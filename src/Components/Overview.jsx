import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabase/supabaseClient";
import Header from "../Views/Header/Header"; // you were already using this

const fmt = (n) => (Number(n) || 0).toFixed(2);
const INR = (n) => `₹${fmt(n)}`;

const Overview = () => {
  const { eventId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    let alive = true;

    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const { data: participantsData, error: participantsErr } =
          await supabase
            .from("participants")
            .select("*")
            .eq("event_id", eventId);
        if (participantsErr) throw participantsErr;

        const { data: expensesData, error: expensesErr } = await supabase
          .from("expenses")
          .select("*")
          .eq("event_id", eventId);
        if (expensesErr) throw expensesErr;

        const { data: evt, error: evtErr } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();
        if (evtErr && evtErr.code !== "PGRST116") {
          console.warn("event fetch warning:", evtErr);
        }

        if (!alive) return;
        setParticipants(participantsData || []);
        setExpenses(expensesData || []);
        setEventData(evt ?? null);
      } catch (err) {
        console.error("Failed to load overview:", err);
        setError(err.message || String(err));
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      alive = false;
    };
  }, [eventId]);

  // total cost of event
  const totalCost = useMemo(
    () => expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
    [expenses]
  );

  // per-person share
  const perPersonShare = useMemo(() => {
    if (participants.length === 0) return 0;
    return Math.round((totalCost / participants.length) * 100) / 100;
  }, [totalCost, participants]);

  // how much each participant paid
  const paidByMap = useMemo(() => {
    const map = {};
    participants.forEach((p) => (map[p.id] = 0));
    expenses.forEach((exp) => {
      const payerId = exp.paid_by ?? exp.paidBy ?? exp.user_id;
      if (payerId != null) {
        map[payerId] = (map[payerId] || 0) + (Number(exp.amount) || 0);
      }
    });
    return map;
  }, [expenses, participants]);

  // balances
  const participantBalances = useMemo(
    () =>
      participants.map((p) => {
        const paid = Number(paidByMap[p.id] || 0);
        const balance = Math.round((paid - perPersonShare) * 100) / 100;
        return {
          id: p.id,
          name: p.name || `Person ${p.id}`,
          paid,
          share: perPersonShare,
          balance,
        };
      }),
    [participants, paidByMap, perPersonShare]
  );

  // Assume current user is first participant (since no auth yet)
  const you = participantBalances[0] || {};
  const yourShare = you.share || 0;
  const youPaid = you.paid || 0;
  const yourBalance = you.balance || 0;

  // simple greedy settlement algorithm
  const settlements = useMemo(() => {
    const creditors = participantBalances
      .filter((p) => p.balance > 0)
      .map((p) => ({ ...p }));
    const debtors = participantBalances
      .filter((p) => p.balance < 0)
      .map((p) => ({ ...p }));

    const moves = [];
    let i = 0,
      j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(-debtor.balance, creditor.balance);

      if (amount > 0.01) {
        moves.push({
          from: debtor.name,
          to: creditor.name,
          amount: fmt(amount),
        });
        debtor.balance += amount;
        creditor.balance -= amount;
      }

      if (Math.abs(debtor.balance) < 0.01) i++;
      if (Math.abs(creditor.balance) < 0.01) j++;
    }
    return moves;
  }, [participantBalances]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* 👇 FIX: eventData instead of event */}
      <Header eventName={eventData?.event_name} />

      <div className="container mx-auto px-12 py-5 max-w-[700px]">
        <p className="font-normal font-raleway text-xl lg:text-2xl">
          Hi {participants[0]?.name}!
        </p>
      </div>

      {/* Overview */}
      <div className="container mx-auto max-w-[700px] px-6 flex flex-col justify-center items-center">
        <div className="bg-[#fffbf2] rounded-2xl shadow2 w-full">
          <div className="border-b border-[#cdc2af] bg-white rounded-t-2xl py-2">
            <p className="font-light font-raleway text-2xl px-4 py-2">
              Overview
            </p>
          </div>
          <div className="py-4 px-6 space-y-2">
            <p className="font-montserrat text-lg">
              This event cost the group: {INR(totalCost)}
            </p>
            <p className="font-montserrat text-lg">
              Your share (cost to you): {INR(yourShare)}
            </p>
            <p className="font-montserrat text-lg">
              You’ve paid: {INR(youPaid)}
            </p>
            <p className="font-montserrat text-lg">
              {yourBalance > 0
                ? `You should receive: ${INR(yourBalance)}`
                : yourBalance < 0
                ? `You owe: ${INR(-yourBalance)}`
                : "You are settled 🎉"}
            </p>
          </div>
          <div className="flex justify-center pb-4">
            <button className="bg-[#a2e3ef] text-[#174953] text-sm font-medium font-montserrat px-4 py-2 rounded-4xl hover:cursor-pointer hover:bg-[#91d1e6] transition duration-300 shadow-btn">
              View expenses
            </button>
            <button className="bg-[#a2e3ef] text-[#174953] text-sm font-medium font-montserrat px-4 py-2 rounded-4xl hover:cursor-pointer hover:bg-[#91d1e6] transition duration-300 shadow-btn">
              Edit expenses
            </button>
          </div>
        </div>
      </div>

      {/* How to settle all debts */}
      <div className="container mx-auto max-w-[700px] px-6 mt-6 flex flex-col justify-center items-center">
        <div className="bg-[#fffbf2] rounded-2xl shadow2 w-full">
          <div className="border-b border-[#cdc2af] bg-white rounded-t-2xl py-2">
            <p className="font-light font-raleway text-2xl px-4 py-2">
              How to settle all debts
            </p>
          </div>
          <div className="py-4 px-6 space-y-2">
            {settlements.length === 0 ? (
              <p className="font-montserrat text-lg">Everyone is settled 🎉</p>
            ) : (
              settlements.map((s, idx) => (
                <p key={idx} className="font-montserrat text-lg">
                  {s.from} gives {INR(s.amount)} to {s.to}
                </p>
              ))
            )}
          </div>
          <div className="flex justify-center pb-4">
            <button className="bg-[#a2e3ef] text-[#174953] text-sm font-medium font-montserrat px-4 py-2 rounded-4xl hover:cursor-pointer hover:bg-[#91d1e6] transition duration-300 shadow-btn">
              Mark as settled
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
