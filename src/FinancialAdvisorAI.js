import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

const FinancialAdvisorAI = () => {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isGeneratingRecommendation, setIsGeneratingRecommendation] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [clientFormData, setClientFormData] = useState({
    name: '',
    age: '',
    income: '',
    netWorth: '',
    riskTolerance: '5',
    investmentGoals: [],
    timeHorizon: '10',
  });

  // Sample data
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  const sampleClients = [
    { id: 1, name: "Sarah Johnson", age: 42, riskScore: 7.2, investmentTotal: 425000, goalProgress: 68 },
    { id: 2, name: "Robert Chen", age: 58, riskScore: 4.3, investmentTotal: 890000, goalProgress: 82 },
    { id: 3, name: "Maria Garcia", age: 35, riskScore: 8.1, investmentTotal: 210000, goalProgress: 45 },
    { id: 4, name: "James Wilson", age: 67, riskScore: 3.2, investmentTotal: 1250000, goalProgress: 94 },
    { id: 5, name: "Aisha Patel", age: 29, riskScore: 9.0, investmentTotal: 125000, goalProgress: 35 }
  ];
  
  const portfolioData = [
    { name: 'US Stocks', value: 45 },
    { name: 'Int\'l Stocks', value: 25 },
    { name: 'Bonds', value: 20 },
    { name: 'Alternatives', value: 7 },
    { name: 'Cash', value: 3 },
  ];
  
  const performanceData = [
    { month: 'Jan', portfolio: 5.2, benchmark: 4.8 },
    { month: 'Feb', portfolio: 3.1, benchmark: 2.7 },
    { month: 'Mar', portfolio: -1.2, benchmark: -2.1 },
    { month: 'Apr', portfolio: 2.8, benchmark: 2.4 },
    { month: 'May', portfolio: 1.9, benchmark: 1.5 },
    { month: 'Jun', portfolio: 4.5, benchmark: 3.8 },
  ];

  // Event handlers
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setActiveTab('client');
    
    // Generate recommendation for selected client
    setIsGeneratingRecommendation(true);
    setTimeout(() => {
      setIsGeneratingRecommendation(false);
      setAiRecommendation({
        riskProfile: {
          score: client.riskScore,
          category: getRiskCategory(client.riskScore),
        },
        allocation: generateAllocation(client.riskScore),
        recommendations: generateRecommendations(client.riskScore),
      });
    }, 1500);
  };

  const handleClientFormChange = (e) => {
    const { name, value } = e.target;
    setClientFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGoalSelection = (goal) => {
    setClientFormData(prev => {
      const currentGoals = [...prev.investmentGoals];
      if (currentGoals.includes(goal)) {
        return { ...prev, investmentGoals: currentGoals.filter(g => g !== goal) };
      } else {
        return { ...prev, investmentGoals: [...currentGoals, goal] };
      }
    });
  };

  const handleClientFormSubmit = (e) => {
    e.preventDefault();
    setShowClientForm(false);
    
    // Create a new client
    const newClient = {
      id: sampleClients.length + 1,
      name: clientFormData.name,
      age: parseInt(clientFormData.age),
      riskScore: parseFloat(clientFormData.riskTolerance),
      investmentTotal: parseInt(clientFormData.netWorth) || 100000,
      goalProgress: 15
    };
    
    // Select the new client
    setSelectedClient(newClient);
    setActiveTab('client');
    
    // Generate recommendation
    setIsGeneratingRecommendation(true);
    setTimeout(() => {
      setIsGeneratingRecommendation(false);
      setAiRecommendation({
        riskProfile: {
          score: parseFloat(clientFormData.riskTolerance),
          category: getRiskCategory(parseFloat(clientFormData.riskTolerance)),
        },
        allocation: generateAllocation(parseFloat(clientFormData.riskTolerance)),
        recommendations: generateRecommendations(parseFloat(clientFormData.riskTolerance)),
      });
    }, 1500);
  };

  // Helper functions
  const getRiskCategory = (score) => {
    if (score <= 2) return 'Conservative';
    if (score <= 4) return 'Moderately Conservative';
    if (score <= 6) return 'Moderate';
    if (score <= 8) return 'Moderately Aggressive';
    return 'Aggressive';
  };
  
  const generateAllocation = (riskScore) => {
    return {
      usStocks: Math.round(Math.min(65, 10 + (riskScore * 6))),
      intlStocks: Math.round(Math.min(40, 5 + (riskScore * 3))),
      bonds: Math.round(Math.max(5, 70 - (riskScore * 6))),
      alternatives: Math.round(Math.min(15, Math.max(0, (riskScore - 3) * 2))),
      cash: Math.round(Math.max(2, 15 - riskScore))
    };
  };
  
  const generateRecommendations = (riskScore) => {
    if (riskScore > 7) {
      return [
        { ticker: "VTI", name: "Vanguard Total Stock Market ETF", allocation: 40, category: "US Stocks" },
        { ticker: "AAPL", name: "Apple Inc.", allocation: 10, category: "US Stocks" },
        { ticker: "MSFT", name: "Microsoft Corporation", allocation: 10, category: "US Stocks" },
        { ticker: "VXUS", name: "Vanguard Total International Stock ETF", allocation: 20, category: "Int'l Stocks" },
        { ticker: "BND", name: "Vanguard Total Bond Market ETF", allocation: 10, category: "Bonds" },
        { ticker: "VNQ", name: "Vanguard Real Estate ETF", allocation: 7, category: "Alternatives" },
        { ticker: "VMFXX", name: "Vanguard Federal Money Market Fund", allocation: 3, category: "Cash" }
      ];
    } else if (riskScore > 4) {
      return [
        { ticker: "VTI", name: "Vanguard Total Stock Market ETF", allocation: 35, category: "US Stocks" },
        { ticker: "VXUS", name: "Vanguard Total International Stock ETF", allocation: 15, category: "Int'l Stocks" },
        { ticker: "BND", name: "Vanguard Total Bond Market ETF", allocation: 40, category: "Bonds" },
        { ticker: "VNQ", name: "Vanguard Real Estate ETF", allocation: 5, category: "Alternatives" },
        { ticker: "VMFXX", name: "Vanguard Federal Money Market Fund", allocation: 5, category: "Cash" }
      ];
    } else {
      return [
        { ticker: "VTI", name: "Vanguard Total Stock Market ETF", allocation: 20, category: "US Stocks" },
        { ticker: "VXUS", name: "Vanguard Total International Stock ETF", allocation: 10, category: "Int'l Stocks" },
        { ticker: "BND", name: "Vanguard Total Bond Market ETF", allocation: 50, category: "Bonds" },
        { ticker: "VTIP", name: "Vanguard TIPS ETF", allocation: 10, category: "Bonds" },
        { ticker: "VMFXX", name: "Vanguard Federal Money Market Fund", allocation: 10, category: "Cash" }
      ];
    }
  };

  // Component for navigation items
  const NavItem = ({ icon, label, active, collapsed, onClick }) => (
    <div 
      className={`flex items-center p-4 cursor-pointer transition-colors ${
        active ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      } ${collapsed ? 'justify-center' : 'justify-start'}`}
      onClick={onClick}
    >
      {icon}
      {!collapsed && <span className="ml-3">{label}</span>}
    </div>
  );

  // Form for creating a new client
  const renderClientForm = () => {
    if (!showClientForm) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">New Client Onboarding</h2>
              <button 
                onClick={() => setShowClientForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleClientFormSubmit}>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={clientFormData.name}
                    onChange={handleClientFormChange}
                    className="w-full border border-gray-300 rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={clientFormData.age}
                    onChange={handleClientFormChange}
                    className="w-full border border-gray-300 rounded p-2"
                    required
                    min="18"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
                  <input
                    type="number"
                    name="income"
                    value={clientFormData.income}
                    onChange={handleClientFormChange}
                    className="w-full border border-gray-300 rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Net Worth</label>
                  <input
                    type="number"
                    name="netWorth"
                    value={clientFormData.netWorth}
                    onChange={handleClientFormChange}
                    className="w-full border border-gray-300 rounded p-2"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance</label>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Conservative</span>
                  <input
                    type="range"
                    name="riskTolerance"
                    min="1"
                    max="10"
                    value={clientFormData.riskTolerance}
                    onChange={handleClientFormChange}
                    className="w-full mx-2"
                  />
                  <span className="text-sm text-gray-600 ml-2">Aggressive</span>
                </div>
                <div className="text-center mt-1 text-sm font-medium">
                  {clientFormData.riskTolerance}/10
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Goals</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Retirement', 'College Fund', 'Home Purchase', 'Wealth Building', 'Tax Optimization', 'Income Generation'].map((goal) => (
                    <div 
                      key={goal}
                      className={`border rounded-lg p-3 cursor-pointer ${
                        clientFormData.investmentGoals.includes(goal) 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleGoalSelection(goal)}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-2 ${
                          clientFormData.investmentGoals.includes(goal)
                            ? 'bg-blue-500' 
                            : 'border border-gray-400'
                        }`}></div>
                        <span>{goal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Horizon (years)</label>
                <input
                  type="number"
                  name="timeHorizon"
                  value={clientFormData.timeHorizon}
                  onChange={handleClientFormChange}
                  className="w-full border border-gray-300 rounded p-2"
                  required
                  min="1"
                  max="50"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowClientForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Generate AI Recommendations
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Component for the main content of the app
  const renderContent = () => {
    return (
      <div className={`min-h-screen pt-16 ${showSidebar ? 'ml-64' : 'ml-16'} transition-all duration-300 bg-gray-100`}>
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Portfolio Performance</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip formatter={(value) => [`${value}%`, '']} />
                      <Legend />
                      <Line type="monotone" dataKey="portfolio" stroke="#0088FE" activeDot={{ r: 8 }} strokeWidth={2} name="Client Portfolio" />
                      <Line type="monotone" dataKey="benchmark" stroke="#888" strokeDasharray="5 5" name="Benchmark" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Recommendations</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-2">Sarah Johnson</td>
                          <td className="px-4 py-2">Mar 25, 2025</td>
                          <td className="px-4 py-2">Portfolio Rebalance</td>
                          <td className="px-4 py-2"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span></td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Robert Chen</td>
                          <td className="px-4 py-2">Mar 23, 2025</td>
                          <td className="px-4 py-2">New Investment</td>
                          <td className="px-4 py-2"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span></td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2">Maria Garcia</td>
                          <td className="px-4 py-2">Mar 20, 2025</td>
                          <td className="px-4 py-2">Tax Optimization</td>
                          <td className="px-4 py-2"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Model Portfolio</h2>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={portfolioData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {portfolioData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Clients</h2>
                    <button 
                      onClick={() => setShowClientForm(true)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      + New Client
                    </button>
                  </div>
                  <div className="space-y-3">
                    {sampleClients.map(client => (
                      <div 
                        key={client.id}
                        className="p-3 border rounded hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleClientSelect(client)}
                      >
                        <div className="font-medium">{client.name}</div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">${client.investmentTotal.toLocaleString()}</span>
                          <span className={client.riskScore > 7 ? 'text-amber-600' : 'text-blue-600'}>
                            Risk: {client.riskScore}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        
          {activeTab === 'client' && selectedClient && (
            <div>
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-2xl font-bold">{selectedClient.name}</h1>
                    <p className="text-gray-600">Age: {selectedClient.age} | Risk Score: {selectedClient.riskScore}</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Generate Report
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-blue-600 mb-1 font-medium">Total Investment</div>
                    <div className="text-2xl font-bold">${selectedClient.investmentTotal.toLocaleString()}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-green-600 mb-1 font-medium">Goal Progress</div>
                    <div className="text-2xl font-bold">{selectedClient.goalProgress}%</div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="text-amber-600 mb-1 font-medium">Risk Category</div>
                    <div className="text-2xl font-bold">{getRiskCategory(selectedClient.riskScore)}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-purple-600 mb-1 font-medium">Last Review</div>
                    <div className="text-2xl font-bold">30 days ago</div>
                  </div>
                </div>
              </div>

              {isGeneratingRecommendation ? (
                <div className="bg-white shadow rounded-lg p-8 text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h2 className="text-xl font-semibold mb-2">AI is generating investment recommendations</h2>
                  <p className="text-gray-600">This may take a moment as we analyze market conditions and risk factors...</p>
                </div>
              ) : aiRecommendation ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                      <h2 className="text-xl font-semibold mb-4">AI-Generated Recommendation</h2>
                      
                      <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <h3 className="font-medium mb-2">Portfolio Strategy</h3>
                        <p className="text-gray-700">
                          Based on your client's {aiRecommendation.riskProfile.category.toLowerCase()} risk profile (score: {aiRecommendation.riskProfile.score.toFixed(1)}/10), 
                          we recommend a diversified portfolio that balances growth and stability.
                        </p>
                      </div>
                      
                      <h3 className="font-medium mb-3">Recommended Asset Allocation</h3>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'US Stocks', value: aiRecommendation.allocation.usStocks },
                                  { name: 'Int\'l Stocks', value: aiRecommendation.allocation.intlStocks },
                                  { name: 'Bonds', value: aiRecommendation.allocation.bonds },
                                  { name: 'Alternatives', value: aiRecommendation.allocation.alternatives },
                                  { name: 'Cash', value: aiRecommendation.allocation.cash },
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {COLORS.map((color, index) => (
                                  <Cell key={`cell-${index}`} fill={color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="flex items-center">
                                <div className="w-3 h-3 bg-blue-500 mr-2"></div>
                                US Stocks
                              </span>
                              <span className="font-medium">{aiRecommendation.allocation.usStocks}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 mr-2"></div>
                                Int'l Stocks
                              </span>
                              <span className="font-medium">{aiRecommendation.allocation.intlStocks}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="flex items-center">
                                <div className="w-3 h-3 bg-yellow-500 mr-2"></div>
                                Bonds
                              </span>
                              <span className="font-medium">{aiRecommendation.allocation.bonds}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="flex items-center">
                                <div className="w-3 h-3 bg-orange-500 mr-2"></div>
                                Alternatives
                              </span>
                              <span className="font-medium">{aiRecommendation.allocation.alternatives}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="flex items-center">
                                <div className="w-3 h-3 bg-purple-500 mr-2"></div>
                                Cash
                              </span>
                              <span className="font-medium">{aiRecommendation.allocation.cash}%</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Growth Assets</span>
                              <span className="font-medium">{aiRecommendation.allocation.usStocks + aiRecommendation.allocation.intlStocks + aiRecommendation.allocation.alternatives}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Defensive Assets</span>
                              <span className="font-medium">{aiRecommendation.allocation.bonds + aiRecommendation.allocation.cash}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="font-medium mb-3">Recommended Investments</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ticker</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Allocation</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {aiRecommendation.recommendations.map((rec, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-3 py-2 whitespace-nowrap font-medium">{rec.ticker}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{rec.name}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{rec.category}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{rec.allocation}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-6 flex justify-end space-x-3">
                        <button className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                          Modify
                        </button>
                        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                          Approve & Implement
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-1">
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                      <h2 className="text-xl font-semibold mb-4">Risk Analysis</h2>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Conservative</span>
                          <span>Aggressive</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${selectedClient.riskScore * 10}%` }}
                          ></div>
                        </div>
                        <div className="text-right text-sm font-medium">
                          Score: {selectedClient.riskScore.toFixed(1)}/10
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Volatility Tolerance</span>
                          <span className={selectedClient.riskScore > 7 ? 'text-amber-600 font-medium' : 'text-blue-600 font-medium'}>
                            {selectedClient.riskScore > 8 ? 'Very High' : 
                             selectedClient.riskScore > 6 ? 'High' : 
                             selectedClient.riskScore > 4 ? 'Moderate' : 
                             selectedClient.riskScore > 2 ? 'Low' : 'Very Low'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Income Needs</span>
                          <span className="text-blue-600 font-medium">
                            {selectedClient.riskScore < 4 ? 'High' : 'Low'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Loss Capacity</span>
                          <span className="text-blue-600 font-medium">
                            {selectedClient.riskScore > 7 ? 'High' : 
                             selectedClient.riskScore > 4 ? 'Moderate' : 'Low'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white shadow rounded-lg p-6">
                      <h2 className="text-xl font-semibold mb-4">Expected Returns</h2>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">1 Year Projection</span>
                            <span className="font-medium">{5 + selectedClient.riskScore * 0.5}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(5 + selectedClient.riskScore * 0.5) * 5}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">5 Year (Annualized)</span>
                            <span className="font-medium">{6 + selectedClient.riskScore * 0.6}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(6 + selectedClient.riskScore * 0.6) * 5}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">10 Year (Annualized)</span>
                            <span className="font-medium">{7 + selectedClient.riskScore * 0.7}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${(7 + selectedClient.riskScore * 0.7) * 5}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                        *Projected returns are estimates based on historical data and are not guaranteed.
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white h-screen ${showSidebar ? 'w-64' : 'w-16'} fixed left-0 top-0 transition-all duration-300 z-10`}>
        <div className="p-4 flex items-center justify-between">
          {showSidebar && <div className="font-bold text-xl">InvestAI</div>}
          <button 
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-1 rounded hover:bg-gray-700"
          >
            {showSidebar ? "◀" : "▶"}
          </button>
        </div>
        
        <div className="mt-6">
          <NavItem 
            icon="🏠" 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            collapsed={!showSidebar}
            onClick={() => {
              setActiveTab('dashboard');
              setSelectedClient(null);
            }}
          />
          <NavItem 
            icon="👥" 
            label="Clients" 
            active={activeTab === 'client'} 
            collapsed={!showSidebar}
            onClick={() => setActiveTab('clients')}
          />
          <NavItem 
            icon="📊" 
            label="Portfolios" 
            active={false} 
            collapsed={!showSidebar}
            onClick={() => alert("This feature is coming soon!")}
          />
          <NavItem 
            icon="📝" 
            label="Reports" 
            active={false} 
            collapsed={!showSidebar}
            onClick={() => alert("This feature is coming soon!")}
          />
          <NavItem 
            icon="⚠️" 
            label="Risk Analysis" 
            active={false} 
            collapsed={!showSidebar}
            onClick={() => alert("This feature is coming soon!")}
          />
          <NavItem 
            icon="⚙️" 
            label="Settings" 
            active={false} 
            collapsed={!showSidebar}
            onClick={() => alert("This feature is coming soon!")}
          />
        </div>
      </div>
      
      {/* Top Navigation Bar */}
      <div className="fixed top-0 right-0 left-0 bg-white shadow-sm px-6 py-3 flex justify-between items-center z-10" style={{ 
        left: showSidebar ? '16rem' : '4rem' 
      }}>
        <div className="font-bold text-xl">
          {activeTab === 'dashboard' && "Dashboard"}
          {activeTab === 'clients' && "Clients"}
          {activeTab === 'client' && selectedClient && selectedClient.name}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="border border-gray-300 rounded-lg px-4 py-2 w-64"
            />
          </div>
          
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
            <span className="font-semibold">FA</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      {renderContent()}
      
      {/* Client Onboarding Form */}
      {renderClientForm()}
    </div>
  );
};

export default FinancialAdvisorAI;
