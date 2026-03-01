import React from 'react';

const UsersManagementView = ({
  users,
  newUserUsernameRef,
  newUserPasswordRef,
  addCashier,
  removeUser
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#1A1A1D] rounded-lg border-2 border-gray-200 dark:border-gray-600 p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Add Cashier</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            ref={newUserUsernameRef}
            defaultValue=""
            placeholder="Username"
            className="px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
          />
          <input
            ref={newUserPasswordRef}
            type="password"
            defaultValue=""
            placeholder="Password"
            className="px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
          />
          <button onClick={addCashier} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">Add Cashier</button>
        </div>
      </div>
      <div className="bg-white dark:bg-[#1A1A1D] rounded-lg border-2 border-gray-200 dark:border-gray-600 overflow-hidden">
        <div className="bg-gray-50 dark:bg-[#1A1A1D] px-6 py-4 border-b-2 border-gray-200 dark:border-gray-600">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#1A1A1D] border-b-2 border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Username</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Created</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-[#27272a] transition-colors">
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{u.id}</td>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{u.username}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{u.role}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{new Date(u.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {u.role !== 'owner' ? (
                      <button onClick={() => removeUser(u.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Remove</button>
                    ) : (
                      <span className="text-xs text-gray-400">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-400">No users</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManagementView;
