import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import supabase from "../supabase/supabaseClient";
import Header from "../Views/Header/Header";
import back from "../assets/back.svg";
import Loader from "../Views/Layout/Loader/Loader";

const AddExpense = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [expenseAdded, setExpenseAdded] = useState(false);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [paidBy, setPaidBy] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [splitOption, setSplitOption] = useState("equal");
  const [customSplits, setCustomSplits] = useState({});
  const [date, setDate] = useState("");

  // fetch event & participants
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (eventError) throw eventError;

        const { data: participantsData, error: participantsError } =
          await supabase
            .from("participants")
            .select("id, name, email")
            .eq("event_id", eventId);

        if (participantsError) throw participantsError;

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

  // set default payer
  useEffect(() => {
    if (participants.length > 0 && !paidBy) {
      setPaidBy(participants[0].id);
    }
  }, [participants, paidBy]);

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setSplitOption("equal");
    setCustomSplits({});
    setDate("");
    setPaidBy(participants.length > 0 ? participants[0].id : "");
  };

  // submit
  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!paidBy || !description || !amount) {
      alert("Please fill all fields");
      return;
    }

    try {
      // insert expense
      const { data: expenseData, error: expenseError } = await supabase
        .from("expenses")
        .insert([
          {
            event_id: eventId,
            paid_by: paidBy,
            description,
            amount: Number(amount),
            created_at: date
              ? new Date(date).toISOString()
              : new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (expenseError) throw expenseError;

      // insert splits
      if (splitOption === "equal") {
        const equalAmount = Number(amount) / participants.length;
        const splits = participants.map((p) => ({
          expense_id: expenseData.id,
          participant_id: p.id,
          amount: equalAmount,
        }));
        const { error: splitError } = await supabase
          .from("expense_splits")
          .insert(splits);
        if (splitError) throw splitError;
      } else if (splitOption === "different") {
        const splits = Object.entries(customSplits).map(
          ([participantId, amt]) => ({
            expense_id: expenseData.id,
            participant_id: participantId,
            amount: Number(amt),
          })
        );
        const { error: splitError } = await supabase
          .from("expense_splits")
          .insert(splits);
        if (splitError) throw splitError;
      }

      console.log("Expense added:", expenseData);
      alert("Expense added successfully!");
      setExpenseAdded(true);
      resetForm();
    } catch (err) {
      console.error(err.message);
      alert("Error adding expense: " + err.message);
    }
  };

  if (loading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <div className="bg-[#dfebed] min-h-screen">
      <Header eventName={event?.event_name} />
      <div className="container mx-auto px-6 lg:px-12 py-10 max-w-[700px] space-y-5">
        <div>
          {!expenseAdded ? (
            <Link to={`/created-kitty/${eventId}`}>
              <button className="hover:cursor-pointer text-base lg:text-lg font-medium font-raleway text-[#a369ab] flex gap-1 items-center">
                <img src={back} alt="back icon" className="size-3 lg:size-5" />
                <p>Back</p>
              </button>
            </Link>
          ) : (
            <button
              onClick={() => navigate(`/events/${eventId}/overview`)}
              className="hover:cursor-pointer text-base lg:text-lg font-medium font-raleway text-[#a369ab] flex gap-1 items-center"
            >
              <img src={back} alt="back icon" className="size-3 lg:size-5" />
              <p>Back</p>
            </button>
          )}
        </div>
        <div className="bg-white px-5 py-4 rounded-2xl shadow2">
          <div className="bg-[#fcfbfa] py-1 ">
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
              paid for something
            </p>
          </div>

          <div className="bg-[#fcfbfa] px-2 py-1">
            <form className="space-y-4" onSubmit={handleAddExpense}>
              <div className="flex flex-col space-y-2">
                <label className="font-normal font-montserrat">What for?</label>
                <input
                  type="text"
                  placeholder="Ski Trip"
                  className="border border-[#cdc2af] rounded px-3 py-2 max-w-[322px] shadow1 bg-white font-raleway"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-normal font-montserrat">How much?</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border border-[#cdc2af] rounded px-3 py-2 max-w-[322px] bg-white shadow1 font-raleway"
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
                    name="splitOption"
                    id="different"
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
                <label className="font-normal font-montserrat">When?</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border border-[#cdc2af] rounded px-3 py-2 max-w-[322px] bg-white shadow1 font-raleway"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="bg-[#a2e3ef] text-[#174953] text-sm font-medium font-montserrat px-4 py-2 rounded-4xl hover:cursor-pointer hover:bg-[#91d1e6] transition duration-300 shadow-btn"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-[#ebe6dd] text-gray-800 px-4 py-2 rounded-2xl whitespace-nowrap shadow-outer text-sm font-medium font-montserrat"
                >
                  Cancel
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
