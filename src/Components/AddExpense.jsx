import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabase/supabaseClient"; // adjust import path
import Header from "../Views/Header/Header"; // ✅ reuse your Header component

const AddExpense = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch event by id
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (error) throw error;
        setEvent(data);
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

  return (
    <div>
      <Header eventName={event?.event_name} />
    </div>
  );
};

export default AddExpense;
