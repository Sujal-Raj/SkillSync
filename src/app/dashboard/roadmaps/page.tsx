export default function RoadmapsPage() {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">My Roadmaps</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="font-bold text-lg mb-2">Roadmap {item}</h3>
              <p className="text-gray-600 mb-4">This is a sample roadmap description.</p>
              <div className="flex justify-end">
                <button className="text-blue-600 hover:text-blue-800">View details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }