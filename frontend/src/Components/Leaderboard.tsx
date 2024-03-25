import { Navbar } from "../Division/Navbar";

// Define the TypeScript interface for the data items
interface UserScore {
  email: string;
  score: string;
}

// Example data
const userData: UserScore[] = [
    {
        "email": "sudhanshu.jangid@gmail.com",
        "score": "95"
    },
    {
        "email": "vipul.chauhan@gmail.com",
        "score": "85"
    },
    // Add the rest of your data items here...
    {
        "email": "sudhir.kumar@gmail.com",
        "score": "45"
    },
    {
        "email": "aman.kumar@gmail.com",
        "score": "55"
    },
    {
        "email": "shushma@gmail.com",
        "score": "90"
    },
    {
        "email": "admin@gmail.com",
        "score": "2"
    }
];

// Function to sort userData by score in descending order
const sortedUserData: UserScore[] = userData.sort((a, b) => parseInt(b.score) - parseInt(a.score));

export function Leaderboard(){
  return (
    <div>
        <div>
        <Navbar />
    </div>
    <div className="container mx-auto px-4">
        
        <h2 className="text-2xl font-semibold text-gray-800 my-4">User Scores</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="w-full h-16 border-gray-300 border-b py-8">
                <th className="text-left pl-8 pr-6 text-sm font-medium text-gray-600 uppercase tracking-wider">Index</th>
                <th className="text-left pl-8 pr-6 text-sm font-medium text-gray-600 uppercase tracking-wider">Email</th>
                <th className="text-left pl-6 pr-8 text-sm font-medium text-gray-600 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody>
              {sortedUserData.map((user, index) => (
                <tr key={index} className="h-14 border-gray-300 border-b">
                  <td className="text-sm text-gray-900 font-light px-8 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="text-sm text-gray-900 font-light px-8 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="text-sm text-gray-500 font-light px-6 py-4 whitespace-nowrap">{user.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>

    </div>
    
  );
}
