
const LandingTrack = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 bg-green-50 text-green-800 rounded-full font-medium text-sm mb-4">Coming Soon</div>
          <h2 className="text-4xl font-medium text-gray-900 mb-4">Track — Hold Power Accountable</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow the money. Follow the promises. Expose the truth.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {/* Track Item 1 */}
          <div className="bg-green-50 p-6 rounded-xl border border-green-700">
            <div className="text-green-700 text-2xl font-semibold mb-2">Budgets</div>
            <p className="text-gray-700">Where the money is supposed to go and where it went.</p>
          </div>

          {/* Track Item 2 */}
          <div className="bg-green-50 p-6 rounded-xl border border-green-700">
            <div className="text-green-700 text-2xl font-semibold mb-2">Bills</div>
            <p className="text-gray-700">What's being passed and who benefits.</p>
          </div>

          {/* Track Item 3 */}
          <div className="bg-green-50 p-6 rounded-xl border border-green-700">
            <div className="text-green-700 text-2xl font-semibold mb-2">Projects</div>
            <p className="text-gray-700">What's being done in your community?</p>
          </div>

          {/* Track Item 4 */}
          <div className="bg-green-50 p-6 rounded-xl border border-green-700">
            <div className="text-green-700 text-2xl font-semibold mb-2">Policies</div>
            <p className="text-gray-700">What they promised, what's delivered.</p>
          </div>
        </div>

        {/* Vote Right Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-medium text-gray-900 mb-3">Vote Right. Watch the Vote. Protect Your Vote.</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Voting Info */}
            <div className=" border border-gray-200 p-8 rounded-xl shadow-sm">
              <div className="bg-green-100 rounded-full w-14 h-14 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-4">Register and prepare to vote wisely</h4>
              <p className="text-gray-700">
                Get updates on how to register, confirm your details, and access election information, including details on candidates running, their track record, and their promises.
              </p>
            </div>

            {/* Monitor Votes */}
            <div className=" border border-gray-200 p-8 rounded-xl shadow-sm">
              <div className="bg-green-100 rounded-full w-14 h-14 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-4">Monitor & Protect Your Votes</h4>
              <p className="text-gray-700">
                Submit polling unit results, reports with photos, and incidents. Help build real-time, citizen-driven election evidence to enable effective litigation.
              </p>
            </div>

            {/* Results Section */}
            <div className=" border border-gray-200 p-8 rounded-xl shadow-sm">
              <div className="bg-green-100 rounded-full w-14 h-14 flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-4">Results</h4>
              <p className="text-gray-700">
                Track ongoing and past election results by polling unit, ward, or state. A vote not protected is a voice wasted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingTrack;
