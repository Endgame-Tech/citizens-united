import { useState } from "react";
import LeaderCard from "./components/LeaderCard";
import { statesLGAWardList } from "../../../utils/StateLGAWard";
import { leadersMockData } from "../../../lib/mockLeaders";
import MyLeadersHero from "./components/MyLeadersHero";

export default function MyLeaders() {
  const [state, setState] = useState("");
  const [lga, setLGA] = useState("");
  const [ward, setWard] = useState("");

  const filteredLeaders = leadersMockData.filter(
    (leader) =>
      (!state || leader.state === state) &&
      (!lga || leader.lga === lga) &&
      (!ward || leader.ward === ward)
  );

  const groupByLevel = (level: string) =>
    filteredLeaders.filter((l) => l.level === level);

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm max-w-6xl mx-auto mt-8 font-poppins">
      <MyLeadersHero />
      {/* <div className="mb-8">
        <h2 className="text-4xl font-normal text-[#006837]">My Leaders</h2>
        <p className="text-sm text-gray-600 mt-1">
          Know who represents you at every level of government based on your location.
        </p>
      </div> */}

      {/* Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          className="border rounded-lg p-3 text-sm"
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setLGA("");
          }}
        >
          <option value="">Select State</option>
          {statesLGAWardList.map((s) => (
            <option key={s.state} value={s.state}>
              {s.state}
            </option>
          ))}
        </select>

        <select
          className="border rounded-lg p-3 text-sm"
          value={lga}
          onChange={(e) => setLGA(e.target.value)}
          disabled={!state}
        >
          <option value="">Select LGA</option>
          {state &&
            statesLGAWardList
              .find((s) => s.state === state)
              ?.lgas.map((lgaObj) => (
                <option key={lgaObj.lga} value={lgaObj.lga}>
                  {lgaObj.lga}
                </option>
              ))}
        </select>

        <input
          type="text"
          placeholder="Ward (optional)"
          className="border rounded-lg p-3 text-sm"
          value={ward}
          onChange={(e) => setWard(e.target.value)}
        />
      </div>

      <button
        className="bg-[#006837] text-white text-sm py-3 px-6 rounded-lg font-semibold mb-8 w-full md:w-auto"
        onClick={() => { }} // You can handle a search trigger here
      >
        Find My Representatives
      </button>

      {/* Results */}
      {["Federal", "State", "Local"].map((level) => {
        const leaders = groupByLevel(level);
        if (!leaders.length) return null;
        return (
          <div key={level} className="mb-10">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{level} Representatives</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {leaders.map((leader) => (
                <LeaderCard key={leader.id} leader={leader} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
