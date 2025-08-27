import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabase/supabaseClient";
import Header from "../Views/Header/Header";

const AddExpense = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (!error) setEvent(data);
    };

    const fetchParticipants = async () => {
      const { data, error } = await supabase
        .from("participants")
        .select("*")
        .eq("event_id", eventId);

      if (!error) setParticipants(data);
    };

    fetchEvent();
    fetchParticipants();
  }, [eventId]);
  return (
    <div className="bg-[#dfebed] h-screen">
      <Header eventName={event?.event_name} />

      <div className="p-4">
        <h2 className="text-lg font-bold">Participants</h2>
        <ul className="list-disc ml-6">
          {participants.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddExpense;
