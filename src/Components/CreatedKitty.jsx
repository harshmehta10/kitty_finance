import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import supabase from "../supabase/supabaseClient";
import { useNavigate } from "react-router-dom";
import Header from "../Views/Header/Header";

const CreatedKitty = () => {
  const { kittyId } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAddExpense = () => {
    navigate(`/addexpense/${event.id}`);
  };

  useEffect(() => {
    const fetchEventAndParticipants = async () => {
      try {
        // fetch event name
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("id, event_name")
          .eq("id", kittyId)
          .single();

        if (eventError) throw eventError;

        // fetch participants for this event
        const { data: participantsData, error: participantsError } =
          await supabase
            .from("participants")
            .select("id, name, email") // add more fields if you have
            .eq("event_id", kittyId);

        if (participantsError) throw participantsError;

        setEvent(eventData);
        setParticipants(participantsData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndParticipants();
  }, [kittyId]);

  if (loading) return <p>Loading event...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-[#dfebed] h-screen">
      <Header eventName={event?.event_name} />

      <div className="container mx-auto px-12 py-5 max-w-[700px]">
        <p className="font-normal font-raleway text-2xl">
          Hi {participants[0]?.name}!
        </p>
      </div>
      <div className="container mx-auto rounded-2xl shadow2 max-w-[700px] bg-[#fffbf2]">
        <div className="border-b border-[#cdc2af] bg-white rounded-t-2xl py-2">
          <p className="font-light font-raleway text-2xl px-4 py-2 ">
            Your Kitty "{event.event_name}" is created{" "}
          </p>
        </div>
        <div className="py-4">
          <p className="font-normal font-raleway text-xl px-4 py-2">
            What's next?
          </p>
          <ul className="list-disc pl-10 space-y-1">
            <li>
              <p className="font-normal font-montserrat text-lg ">
                Invite your friends to participate in this Kitty
              </p>
            </li>
            <li>
              <p className="font-normal font-montserrat text-lg ">
                For families or couples who share their balance, set up default
                shares.
              </p>
            </li>
            <li>
              <p className="font-normal font-montserrat text-lg ">
                Enter your first expense:
              </p>
            </li>
          </ul>
        </div>
        <div className="flex justify-center pb-4">
          <button
            className="bg-[#a2e3ef] text-[#174953] text-sm font-medium font-montserrat px-4 py-2 rounded-4xl hover:cursor-pointer hover:bg-[#91d1e6] transition duration-300 shadow-btn"
            onClick={handleAddExpense}
          >
            Add expense
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatedKitty;
