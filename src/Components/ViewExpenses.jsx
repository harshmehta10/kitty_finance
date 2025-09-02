import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import supabase from "../supabase/supabaseClient";
import Header from "../Views/Header/Header";
import Loader from "../Views/Layout/Loader/Loader";
import back from "../assets/back.svg";

const ViewExpenses = () => {
  const { eventId } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventName, setEventName] = useState("Loading...");

  // Fetch expenses + participants
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch expenses
        const { data: expenseData, error: expenseError } = await supabase
          .from("expenses")
          .select("*")
          .eq("event_id", eventId);

        if (expenseError) throw expenseError;

        //3.fetch header
        // Fetch event header details
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*") // fetch all columns
          .eq("id", eventId)
          .single();

        if (eventError) {
          console.warn("Event fetch error:", eventError.message);
          setEventName("Untitled Event"); // fallback so UI stays stable
        } else {
          setEventName(
            eventData?.name || eventData?.event_name || "Untitled Event"
          );
        }

        // 2. Fetch participants
        const { data: participantsData, error: participantsError } =
          await supabase
            .from("participants")
            .select("*")
            .eq("event_id", eventId);

        if (participantsError) throw participantsError;

        setExpenses(expenseData || []);
        setParticipants(participantsData || []);
      } catch (err) {
        console.error("Error fetching data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  // Helper function to get participant name
  const getParticipantName = (id) => {
    const participant = participants.find((p) => p.id === id);
    return participant ? participant.name : "Unknown";
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500">
        <Loader />
      </p>
    );
  }

  return (
    <div className="bg-[#fffbf2] h-screen">
      <Header eventName={eventName} />

      <div className="container mx-auto px-12 py-5 max-w-[700px] space-y-4">
        <div>
          <Link to={`/events/${eventId}/Overview`}>
            <button className="hover:cursor-pointer text-base lg:text-lg font-medium font-raleway text-[#a369ab] flex gap-1 items-center">
              <img src={back} alt="back icon" className="size-3 lg:size-5" />
              <p>Back</p>
            </button>
          </Link>
        </div>
        <h1 className="font-montserrat text-2xl font-normal">View Expenses</h1>
      </div>

      <div className="space-y-4 container mx-auto px-12  max-w-[700px]">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="px-4 py-5 rounded-xl shadow2 bg-white space-y-4"
          >
            <p className="font-medium font-raleway text-xl">
              {expense.description}
            </p>
            <div className="flex justify-between items-center">
              <p className="font-normal font-raleway text-xl">Total Amount:</p>
              <p className="font-normal font-raleway text-xl">
                ₹{expense.amount}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-normal font-raleway text-xl"> Paid by:</p>
              <p className="font-normal font-raleway text-xl">
                {" "}
                {getParticipantName(expense.paid_by)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewExpenses;
