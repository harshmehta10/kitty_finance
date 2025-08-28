import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import supabase from "../supabase/supabaseClient";
import Header from "../Views/Header/Header";
import back from "../assets/back.svg";

const AddExpense = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [paidBy, setPaidBy] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [splitOption, setSplitOption] = useState("equal"); // "equal" or "different"
  const [customSplits, setCustomSplits] = useState({});
  const [date, setDate] = useState("");
  // fetch event by id
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // fetch event
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (eventError) throw eventError;

        // fetch participants
        const { data: participantsData, error: participantsError } =
          await supabase
            .from("participants")
            .select("id, name, email")
            .eq("event_id", eventId);

        if (participantsError) throw participantsError;

        console.log("event:", eventData);
        console.log("participants:", participantsData);

        setEvent(eventData);
        setParticipants(participantsData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) fetchEvent();
  }, [eventId]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!paidBy || !description || !amount) {
      alert("Please fill all fields");
      return;
    }

    try {
      // 1️⃣ Insert expense into expenses table
      const { data: expenseData, error: expenseError } = await supabase
        .from("expenses")
        .insert([
          {
            event_id: eventId,
            paid_by: paidBy,
            description,
            amount: Number(amount),
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (expenseError) throw expenseError;

      console.log("Expense added:", expenseData);

      // 2️⃣ Now handle splits
      if (splitOption === "equal") {
        const equalAmount = Number(amount) / participants.length;

        const splits = participants.map((p) => ({
          expense_id: expenseData.id,
          participant_id: p.id,
          share_amount: equalAmount,
        }));

        const { error: splitError } = await supabase
          .from("expense_splits")
          .insert(splits);

        if (splitError) throw splitError;

        console.log("Equal split inserted:", splits);
      }

      if (splitOption === "different") {
        const splits = Object.entries(customSplits).map(
          ([participantId, amt]) => ({
            expense_id: expenseData.id,
            participant_id: participantId,
            share_amount: Number(amt),
          })
        );

        const { error: splitError } = await supabase
          .from("expense_splits")
          .insert(splits);

        if (splitError) throw splitError;

        console.log("Custom split inserted:", splits);
      }

      alert("Expense added successfully!");

      // 3️⃣ Clear the form
      setPaidBy("");
      setDescription("");
      setAmount("");
      setSplitOption("equal");
      setCustomSplits({});
    } catch (err) {
      console.error(err.message);
      alert("Error adding expense: " + err.message);
    }
  };

  return (
    <div className="bg-[#dfebed] h-screen">
      <Header eventName={event?.event_name} />
      <div className="container mx-auto px-6 lg:px-12 py-10 max-w-[700px] space-y-5">
        <div>
          <Link to={`/created-kitty/${eventId}`}>
            <button className="hover:cursor-pointer  text-base lg:text-lg font-medium font-raleway text-[#a369ab] flex gap-1 items-center">
              <img src={back} alt="back icon" className="size-3 lg:size-5" />
              <p>Back</p>
            </button>
          </Link>
        </div>
        <div className="bg-white px-5 py-4 rounded-2xl shadow2">
          <div className="bg-[#fcfbfa]  py-1 ">
            <p className="font-normal font-montserrat">Expense</p>
          </div>
          <div className="bg-[#fcfbfa] px-2 py-1">
            <p className="font-normal font-montserrat mb-2 flex items-center gap-2">
              <select
                className="border rounded px-2 py-1"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
              >
                {participants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              paid for Something
            </p>
          </div>

          <div className="bg-[#fcfbfa] px-2 py-1">
            <form className="space-y-4">
              <div className="space-y-2 flex flex-col ">
                <label className="font-normal font-montserrat mb-2">
                  What for?
                </label>
                <input
                  type="text"
                  placeholder="Ski Trip"
                  className="border border-[#cdc2af]  rounded px-3 py-2 max-w-[322px] shadow1 bg-white font-raleway"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-normal font-montserrat mb-2">
                  How much?
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border border-[#cdc2af] rounded p-2  mb-2  max-w-[322px] bg-white shadow1 font-raleway"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="splitOption"
                    id="equal"
                    checked={splitOption === "equal"}
                    onChange={() => setSplitOption("equal")}
                  />
                  <label htmlFor="equal">Split equally between everyone</label>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="split"
                    value="different"
                    checked={splitOption === "different"}
                    onChange={() => setSplitOption("different")}
                  />
                  <label htmlFor="different">Split differently</label>
                </div>
                {splitOption === "different" && (
                  <div className="mt-3 space-y-2">
                    <p className="font-medium">
                      Enter amount for each participant:
                    </p>
                    {participants.map((p) => (
                      <div key={p.id} className="flex items-center space-x-2">
                        <label className="w-32">{p.name}</label>
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-28"
                          value={customSplits[p.id] || ""}
                          onChange={(e) =>
                            setCustomSplits({
                              ...customSplits,
                              [p.id]: e.target.value,
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <label className="font-normal font-montserrat mb-2">
                  When?
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border border-[#cdc2af] rounded p-2  mb-2  max-w-[322px] bg-white shadow1 font-raleway"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  onClick={handleAddExpense}
                  className="bg-[#a2e3ef] text-[#174953] text-sm font-medium font-montserrat px-4 py-2 rounded-4xl hover:cursor-pointer hover:bg-[#91d1e6] transition duration-300 shadow-btn"
                >
                  add
                </button>
                <button className="bg-[#ebe6dd] text-gray-800 px-4 py-2 rounded-2xl whitespace-nowrap  shadow-outer text-sm font-medium font-montserrat">
                  cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
