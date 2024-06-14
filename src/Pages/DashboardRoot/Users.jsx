import React, { useState } from "react";
import "tailwindcss/tailwind.css";

const usersData = [
  {
    username: "anowarulbd",
    name: "MD Anowarul Islam",
    email: "admin@nilakashtoday.com",
    role: "Administrator",
    posts: 5,
    views: 0,
  },
  {
    username: "gvxcgd",
    name: "MD Anowarul Islam",
    email: "dfdfhbf@gmail.com",
    role: "Author",
    posts: 0,
    views: 0,
  },
  {
    username: "nilakashtoday",
    name: "MD Nuruzzaman",
    email: "nilakashtoday@gmail.com",
    role: "Administrator",
    posts: 9698,
    views: 0,
  },
];

const Users = () => {
  const [users, setUsers] = useState(usersData);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [roleChange, setRoleChange] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectUser = (username) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(username)
        ? prevSelected.filter((user) => user !== username)
        : [...prevSelected, username]
    );
  };

  const handleBulkAction = () => {
    // Add your bulk action logic here
    console.log("Bulk Action:", bulkAction, "Users:", selectedUsers);
  };

  const handleRoleChange = () => {
    // Add your role change logic here
    console.log("Change Role to:", roleChange, "Users:", selectedUsers);
  };

  const handleSendPasswordReset = (email) => {
    // Add your send password reset logic here
    console.log("Send Password Reset to:", email);
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // <div className="mt-12 p-4 mx-12 my-12 sm:mx-24 sm:my-24">

    //     <div className="flex flex-wrap justify-between mb-4">
    //     <div className='flex justify-start items-start gap-2'>
    //     <h6 className="text-black text-center text-4xl mb-6">Users</h6>
    //     <button className=" border border-blue-500 text-blue-500 px-4 py-2 rounded">Add New User</button>
    //     </div>
    //         <div className="flex space-x-4">
    //             <input
    //                 type="text"
    //                 placeholder="Search Users"
    //                 value={searchQuery}
    //                 onChange={(e) => setSearchQuery(e.target.value)}
    //                 className="border p-2 rounded"
    //             />
    //             <button className=" border border-blue-500 text-blue-500 px-4 py-2 rounded">Search Users</button>
    //         </div>
    //     </div>
    //     <div className="overflow-x-auto">
    //         <table className="min-w-full bg-white border">
    //             <thead>
    //                 <tr>
    //                     <th className="border px-4 py-2">
    //                         <input
    //                             type="checkbox"
    //                             onChange={(e) =>
    //                                 setSelectedUsers(
    //                                     e.target.checked
    //                                         ? users.map((user) => user.username)
    //                                         : []
    //                                 )
    //                             }
    //                             checked={selectedUsers.length === users.length}
    //                         />
    //                     </th>
    //                     <th className="border px-4 py-2">Username</th>
    //                     <th className="border px-4 py-2">Name</th>
    //                     <th className="border px-4 py-2">Email</th>
    //                     <th className="border px-4 py-2">Role</th>
    //                     <th className="border px-4 py-2">Posts</th>
    //                     <th className="border px-4 py-2">Views</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {filteredUsers.map((user) => (
    //                     <tr key={user.username} className="hover:bg-gray-100 group">
    //                         <td className="border px-4 py-2">
    //                             <input
    //                                 type="checkbox"
    //                                 checked={selectedUsers.includes(user.username)}
    //                                 onChange={() => handleSelectUser(user.username)}
    //                             />
    //                         </td>
    //                         <td className="border px-4 py-2">
    //                             <div className="flex flex-col">
    //                                 <span>{user.username}</span>
    //                                 <div className="hidden group-hover:flex space-x-2">
    //                                     <button className="text-blue-500">Edit</button>
    //                                     <button className="text-red-500">Delete</button>
    //                                     <button className="text-green-500">View</button>
    //                                     <button
    //                                         onClick={() => handleSendPasswordReset(user.email)}
    //                                         className="text-blue-500"
    //                                     >
    //                                         Send Password Reset
    //                                     </button>
    //                                 </div>
    //                             </div>
    //                         </td>
    //                         <td className="border px-4 py-2">{user.name}</td>
    //                         <td className="border px-4 py-2">{user.email}</td>
    //                         <td className="border px-4 py-2">{user.role}</td>
    //                         <td className="border px-4 py-2">{user.posts}</td>
    //                         <td className="border px-4 py-2">{user.views}</td>
    //                     </tr>
    //                 ))}
    //             </tbody>
    //             <tfoot>
    //                 <tr>
    //                     <th className="border px-4 py-2">
    //                         <input
    //                             type="checkbox"
    //                             onChange={(e) =>
    //                                 setSelectedUsers(
    //                                     e.target.checked
    //                                         ? users.map((user) => user.username)
    //                                         : []
    //                                 )
    //                             }
    //                             checked={selectedUsers.length === users.length}
    //                         />
    //                     </th>
    //                     <th className="border px-4 py-2">Username</th>
    //                     <th className="border px-4 py-2">Name</th>
    //                     <th className="border px-4 py-2">Email</th>
    //                     <th className="border px-4 py-2">Role</th>
    //                     <th className="border px-4 py-2">Posts</th>
    //                     <th className="border px-4 py-2">Views</th>
    //                 </tr>
    //             </tfoot>
    //         </table>
    //     </div>
    //     <div className="flex flex-wrap justify-between mt-4">
    //         <div className="mb-4">
    //             <select
    //                 value={bulkAction}
    //                 onChange={(e) => setBulkAction(e.target.value)}
    //                 className="border p-2 rounded mr-2"
    //             >
    //                 <option value="">Bulk actions</option>
    //                 <option value="delete">Delete</option>
    //                 <option value="deactivate">Deactivate</option>
    //             </select>
    //             <button
    //                 onClick={handleBulkAction}
    //                 className="border border-blue-500 text-blue-500   p-2 rounded"
    //             >
    //                 Apply
    //             </button>
    //         </div>
    //         <div>
    //             <select
    //                 value={roleChange}
    //                 onChange={(e) => setRoleChange(e.target.value)}
    //                 className="border p-2 rounded mr-2"
    //             >
    //                 <option value="">Change role to...</option>
    //                 <option value="administrator">Administrator</option>
    //                 <option value="editor">Editor</option>
    //                 <option value="author">Author</option>
    //                 <option value="contributor">Contributor</option>
    //                 <option value="subscriber">Subscriber</option>
    //             </select>
    //             <button
    //                 onClick={handleRoleChange}
    //                 className="border border-blue-500 text-blue-500   p-2 rounded"
    //             >
    //                 Change
    //             </button>
    //         </div>
    //     </div>
    // </div>
    //     <div className="mt-12 p-4 mx-12 my-12">
    //     <div className="flex flex-wrap justify-between mb-4">
    //         <div className='flex justify-start items-start gap-2'>
    //             <h6 className="text-black text-center text-4xl mb-6">Users</h6>
    //             <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded">Add New User</button>
    //         </div>
    //         <div className="flex space-x-4">
    //             <input
    //                 type="text"
    //                 placeholder="Search Users"
    //                 value={searchQuery}
    //                 onChange={(e) => setSearchQuery(e.target.value)}
    //                 className="border p-2 rounded"
    //             />
    //             <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded">Search Users</button>
    //         </div>
    //     </div>
    //     <div className="overflow-x-auto">
    //         <table className="min-w-full bg-white border">
    //             <thead>
    //                 <tr>
    //                     <th className="border px-4 py-2">
    //                         <input
    //                             type="checkbox"
    //                             onChange={(e) =>
    //                                 setSelectedUsers(
    //                                     e.target.checked
    //                                         ? users.map((user) => user.username)
    //                                         : []
    //                                 )
    //                             }
    //                             checked={selectedUsers.length === users.length}
    //                         />
    //                     </th>
    //                     <th className="border px-4 py-2">Username</th>
    //                     <th className="border px-4 py-2">Name</th>
    //                     <th className="border px-4 py-2">Email</th>
    //                     <th className="border px-4 py-2">Role</th>
    //                     <th className="border px-4 py-2">Posts</th>
    //                     <th className="border px-4 py-2">Views</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {filteredUsers.map((user) => (
    //                     <tr key={user.username} className="hover:bg-gray-100 group">
    //                         <td className="border px-4 py-2">
    //                             <input
    //                                 type="checkbox"
    //                                 checked={selectedUsers.includes(user.username)}
    //                                 onChange={() => handleSelectUser(user.username)}
    //                             />
    //                         </td>
    //                         <td className="border px-4 py-2">
    //                             <div className="flex flex-col">
    //                                 <span>{user.username}</span>
    //                                 <div className="hidden group-hover:flex flex-col space-y-1 mt-2">
    //                                     <div className="flex space-x-2">
    //                                         <button className="text-blue-500">Edit</button>
    //                                         <button className="text-red-500">Delete</button>
    //                                         <button className="text-green-500">View</button>
    //                                     </div>
    //                                     <button
    //                                         onClick={() => handleSendPasswordReset(user.email)}
    //                                         className="text-blue-500"
    //                                     >
    //                                         Send Password Reset
    //                                     </button>
    //                                 </div>
    //                             </div>
    //                         </td>
    //                         <td className="border px-4 py-2">{user.name}</td>
    //                         <td className="border px-4 py-2">{user.email}</td>
    //                         <td className="border px-4 py-2">{user.role}</td>
    //                         <td className="border px-4 py-2">{user.posts}</td>
    //                         <td className="border px-4 py-2">{user.views}</td>
    //                     </tr>
    //                 ))}
    //             </tbody>
    //             <tfoot>
    //                 <tr>
    //                     <th className="border px-4 py-2">
    //                         <input
    //                             type="checkbox"
    //                             onChange={(e) =>
    //                                 setSelectedUsers(
    //                                     e.target.checked
    //                                         ? users.map((user) => user.username)
    //                                         : []
    //                                 )
    //                             }
    //                             checked={selectedUsers.length === users.length}
    //                         />
    //                     </th>
    //                     <th className="border px-4 py-2">Username</th>
    //                     <th className="border px-4 py-2">Name</th>
    //                     <th className="border px-4 py-2">Email</th>
    //                     <th className="border px-4 py-2">Role</th>
    //                     <th className="border px-4 py-2">Posts</th>
    //                     <th className="border px-4 py-2">Views</th>
    //                 </tr>
    //             </tfoot>
    //         </table>
    //     </div>
    //     <div className="flex flex-wrap justify-between mt-4">
    //         <div className="mb-4">
    //             <select
    //                 value={bulkAction}
    //                 onChange={(e) => setBulkAction(e.target.value)}
    //                 className="border p-2 rounded mr-2"
    //             >
    //                 <option value="">Bulk actions</option>
    //                 <option value="delete">Delete</option>
    //                 <option value="deactivate">Deactivate</option>
    //             </select>
    //             <button
    //                 onClick={handleBulkAction}
    //                 className="border border-blue-500 text-blue-500 p-2 rounded"
    //             >
    //                 Apply
    //             </button>
    //         </div>
    //         <div>
    //             <select
    //                 value={roleChange}
    //                 onChange={(e) => setRoleChange(e.target.value)}
    //                 className="border p-2 rounded mr-2"
    //             >
    //                 <option value="">Change role to...</option>
    //                 <option value="administrator">Administrator</option>
    //                 <option value="editor">Editor</option>
    //                 <option value="author">Author</option>
    //                 <option value="contributor">Contributor</option>
    //                 <option value="subscriber">Subscriber</option>
    //             </select>
    //             <button
    //                 onClick={handleRoleChange}
    //                 className="border border-blue-500 text-blue-500 p-2 rounded"
    //             >
    //                 Change
    //             </button>
    //         </div>
    //     </div>
    // </div>

    // <div className="mt-12 p-4 mx-4 sm:mx-12 lg:mx-24">
    //         <div className="flex flex-wrap justify-between mb-4">
    //             <div className='flex justify-start items-start gap-2'>
    //                 <h6 className="text-black text-2xl sm:text-4xl mb-6">Users</h6>
    //                 <button className="border border-blue-500 text-blue-500 px-2 sm:px-4 py-1 sm:py-2 rounded">Add New User</button>
    //             </div>
    //             <div className="flex space-x-2 sm:space-x-4">
    //                 <input
    //                     type="text"
    //                     placeholder="Search Users"
    //                     value={searchQuery}
    //                     onChange={(e) => setSearchQuery(e.target.value)}
    //                     className="border p-1 sm:p-2 rounded"
    //                 />
    //                 <button className="border border-blue-500 text-blue-500 px-2 sm:px-4 py-1 sm:py-2 rounded">Search Users</button>
    //             </div>
    //         </div>
    //         <div className="overflow-x-auto">
    //             <table className="min-w-full bg-white border">
    //                 <thead>
    //                     <tr>
    //                         <th className="border px-2 sm:px-4 py-1 sm:py-2">
    //                             <input
    //                                 type="checkbox"
    //                                 onChange={(e) =>
    //                                     setSelectedUsers(
    //                                         e.target.checked
    //                                             ? users.map((user) => user.username)
    //                                             : []
    //                                     )
    //                                 }
    //                                 checked={selectedUsers.length === users.length}
    //                             />
    //                         </th>
    //                         <th className="border px-2 sm:px-4 py-1 sm:py-2">Username</th>
    //                         <th className="border px-2 sm:px-4 py-1 sm:py-2">Name</th>
    //                         <th className="border px-2 sm:px-4 py-1 sm:py-2">Email</th>
    //                         <th className="border px-2 sm:px-4 py-1 sm:py-2">Role</th>
    //                         <th className="border px-2 sm:px-4 py-1 sm:py-2">Posts</th>
    //                         <th className="border px-2 sm:px-4 py-1 sm:py-2">Views</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {filteredUsers.map((user) => (
    //                         <tr key={user.username} className="hover:bg-gray-100 group">
    //                             <td className="border px-2 sm:px-4 py-1 sm:py-2">
    //                                 <input
    //                                     type="checkbox"
    //                                     checked={selectedUsers.includes(user.username)}
    //                                     onChange={() => handleSelectUser(user.username)}
    //                                 />
    //                             </td>
    //                             <td className="border px-2 sm:px-4 py-1 sm:py-2">
    //                                 <div className="flex flex-col">
    //                                     <span>{user.username}</span>
    //                                     <div className="hidden group-hover:flex flex-col space-y-1 mt-2">
    //                                         <div className="flex space-x-2">
    //                                             <button className="text-blue-500">Edit</button>
    //                                             <button className="text-red-500">Delete</button>
    //                                             <button className="text-green-500">View</button>
    //                                         </div>
    //                                         <button
    //                                             onClick={() => handleSendPasswordReset(user.email)}
    //                                             className="text-blue-500"
    //                                         >
    //                                             Send Password Reset
    //                                         </button>
    //                                     </div>
    //                                 </div>
    //                             </td>
    //                             <td className="border px-2 sm:px-4 py-1 sm:py-2">{user.name}</td>
    //                             <td className="border px-2 sm:px-4 py-1 sm:py-2">{user.email}</td>
    //                             <td className="border px-2 sm:px-4 py-1 sm:py-2">{user.role}</td>
    //                             <td className="border px-2 sm:px-4 py-1 sm:py-2">{user.posts}</td>
    //                             <td className="border px-2 sm:px-4 py-1 sm:py-2">{user.views}</td>
    //                         </tr>
    //                     ))}
    //                 </tbody>
    //                 <tfoot>
    //                     <tr>
    //                         <th className="border px-2 sm:px-4 py-1 sm:py-2">
    //                             <input
    //                                 type="checkbox"
    //                                 onChange={(e) =>
    //                                     setSelectedUsers(
    //                                         e.target.checked
    //                                             ? users.map((user) => user.username)
    //                                             : []
    //                                     )
    //                                 }
    //                                 checked={selectedUsers.length === users.length}
    //                             />
    //                         </th>
    //                         <th className="border px-2 sm:px-4 py-1 sm:py-2">Username</th>
    //                         <th className="border px-2 sm:px-4 py-1 sm:py-2">Name</th>
    //                         <th className="border px-2 sm:px-4 py-1 sm:py-2">Email</th>
    //                         <th className="border px-2 sm:px-4 py-1 sm:py-2">Role</th>
    //                         <th className="border px-2 sm:px-4 py-1 sm:py-2">Posts</th>
    //                         <th className="border px-2 sm:px-4 py-1 sm:py-2">Views</th>
    //                     </tr>
    //                 </tfoot>
    //             </table>
    //         </div>
    //         <div className="flex flex-wrap justify-between mt-4">
    //             <div className="mb-4">
    //                 <select
    //                     value={bulkAction}
    //                     onChange={(e) => setBulkAction(e.target.value)}
    //                     className="border p-1 sm:p-2 rounded mr-2"
    //                 >
    //                     <option value="">Bulk actions</option>
    //                     <option value="delete">Delete</option>
    //                     <option value="deactivate">Deactivate</option>
    //                 </select>
    //                 <button
    //                     onClick={handleBulkAction}
    //                     className="border border-blue-500 text-blue-500 p-1 sm:p-2 rounded"
    //                 >
    //                     Apply
    //                 </button>
    //             </div>
    //             <div>
    //                 <select
    //                     value={roleChange}
    //                     onChange={(e) => setRoleChange(e.target.value)}
    //                     className="border p-1 sm:p-2 rounded mr-2"
    //                 >
    //                     <option value="">Change role to...</option>
    //                     <option value="administrator">Administrator</option>
    //                     <option value="editor">Editor</option>
    //                     <option value="author">Author</option>
    //                     <option value="contributor">Contributor</option>
    //                     <option value="subscriber">Subscriber</option>
    //                 </select>
    //                 <button
    //                     onClick={handleRoleChange}
    //                     className="border border-blue-500 text-blue-500 p-1 sm:p-2 rounded"
    //                 >
    //                     Change
    //                 </button>
    //             </div>
    //         </div>
    //     </div>

    //     <div className="mt-12 p-4 mx-4 sm:mx-12 lg:mx-24">
    //     <div className="flex flex-wrap justify-between mb-4">
    //         <div className='flex justify-start items-start gap-2'>
    //             <h6 className="text-black text-2xl sm:text-4xl mb-6">Users</h6>
    //             <button className="border border-blue-500 text-blue-500 px-2 sm:px-4 py-1 sm:py-2 rounded">Add New User</button>
    //         </div>
    //         <div className="flex space-x-2 sm:space-x-4">
    //             <input
    //                 type="text"
    //                 placeholder="Search Users"
    //                 value={searchQuery}
    //                 onChange={(e) => setSearchQuery(e.target.value)}
    //                 className="border p-1 sm:p-2 rounded"
    //             />
    //             <button className="border border-blue-500 text-blue-500 px-2 sm:px-4 py-1 sm:py-2 rounded">Search Users</button>
    //         </div>
    //     </div>
    //     <div className="overflow-x-auto">
    //         <table className="min-w-full bg-white border">
    //             <thead>
    //                 <tr>
    //                     <th className="border px-2 sm:px-4 py-1 sm:py-2">
    //                         <input
    //                             type="checkbox"
    //                             onChange={(e) =>
    //                                 setSelectedUsers(
    //                                     e.target.checked
    //                                         ? users.map((user) => user.username)
    //                                         : []
    //                                 )
    //                             }
    //                             checked={selectedUsers.length === users.length}
    //                         />
    //                     </th>
    //                     <th className="border px-2 sm:px-4 py-1 sm:py-2">Username</th>
    //                     <th className="border px-2 sm:px-4 py-1 sm:py-2">Name</th>
    //                     <th className="border px-2 sm:px-4 py-1 sm:py-2">Email</th>
    //                     <th className="border px-2 sm:px-4 py-1 sm:py-2">Role</th>
    //                     <th className="border px-2 sm:px-4 py-1 sm:py-2">Posts</th>
    //                     <th className="border px-2 sm:px-4 py-1 sm:py-2">Views</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {filteredUsers.map((user) => (
    //                     <tr key={user.username} className="hover:bg-gray-100 group">
    //                         <td className="border px-2 sm:px-4 py-1 sm:py-2">
    //                             <input
    //                                 type="checkbox"
    //                                 checked={selectedUsers.includes(user.username)}
    //                                 onChange={() => handleSelectUser(user.username)}
    //                             />
    //                         </td>
    //                         <td className="border px-2 sm:px-4 py-1 sm:py-2">
    //                             <div className="flex flex-col">
    //                                 <span>{user.username}</span>
    //                                 <div className="hidden group-hover:flex flex-col space-y-1 mt-2">
    //                                     <div className="flex space-x-2">
    //                                         <button className="text-blue-500">Edit</button>
    //                                         <button className="text-red-500">Delete</button>
    //                                         <button className="text-green-500">View</button>
    //                                     </div>
    //                                     <button
    //                                         onClick={() => handleSendPasswordReset(user.email)}
    //                                         className="text-blue-500"
    //                                     >
    //                                         Send Password Reset
    //                                     </button>
    //                                 </div>
    //                             </div>
    //                         </td>
    //                         <td className="border px-2 sm:px-4 py-1 sm:py-2">{user.name}</td>
    //                         <td className="border px-2 sm:px-4 py-1 sm:py-2">{user.email}</td>
    //                         <td className="border px-2 sm:px-4 py-1 sm:py-2">{user.role}</td>
    //                         <td className="border px-2 sm:px-4 py-1 sm:py-2">{user.posts}</td>
    //                         <td className="border px-2 sm:px-4 py-1 sm:py-2">{user.views}</td>
    //                     </tr>
    //                 ))}
    //             </tbody>
    //             <tfoot>
    //                 <tr>
    //                     <th className="border px-2 sm:px-4 py-1 sm:py-2">
    //                         <input
    //                             type="checkbox"
    //                             onChange={(e) =>
    //                                 setSelectedUsers(
    //                                     e.target.checked
    //                                         ? users.map((user) => user.username)
    //                                         : []
    //                                 )
    //                             }
    //                             checked={selectedUsers.length === users.length}
    //                         />
    //                     </th>
    //                     <th className="border px-2 sm:px-4 py-1 sm:py-2">Username</th>
    //                     <th className="border px-2 sm:px-4 py-1 sm:py-2">Name</th>
    //                     <th className="border px-2 sm:px-4 py-1 sm:py-2">Email</th>
    //                     <th className="border px-2 sm:px-4 py-1 sm:py-2">Role</th>
    //                     <th className="border px-2 sm:px-4 py-1 sm:py-2">Posts</th>
    //                     <th className="border px-2 sm:px-4 py-1 sm:py-2">Views</th>
    //                 </tr>
    //             </tfoot>
    //         </table>
    //     </div>
    //     <div className="flex flex-wrap justify-between mt-4">
    //         <div className="mb-4">
    //             <select
    //                 value={bulkAction}
    //                 onChange={(e) => setBulkAction(e.target.value)}
    //                 className="border p-1 sm:p-2 rounded mr-2"
    //             >
    //                 <option value="">Bulk actions</option>
    //                 <option value="delete">Delete</option>
    //                 <option value="deactivate">Deactivate</option>
    //             </select>
    //             <button
    //                 onClick={handleBulkAction}
    //                 className="border border-blue-500 text-blue-500 p-1 sm:p-2 rounded"
    //             >
    //                 Apply
    //             </button>
    //         </div>
    //         <div>
    //             <select
    //                 value={roleChange}
    //                 onChange={(e) => setRoleChange(e.target.value)}
    //                 className="border p-1 sm:p-2 rounded mr-2"
    //             >
    //                 <option value="">Change role to...</option>
    //                 <option value="administrator">Administrator</option>
    //                 <option value="editor">Editor</option>
    //                 <option value="author">Author</option>
    //                 <option value="contributor">Contributor</option>
    //                 <option value="subscriber">Subscriber</option>
    //             </select>
    //             <button
    //                 onClick={handleRoleChange}
    //                 className="border border-blue-500 text-blue-500 p-1 sm:p-2 rounded"
    //             >
    //                 Change
    //             </button>
    //         </div>
    //     </div>
    // </div>

    <div className="mt-12 p-4 mx-4 sm:mx-12 lg:mx-24">
      <div className="flex flex-wrap justify-between mb-4">
        <div className="flex justify-start items-start gap-2">
          <h6 className="text-black text-2xl sm:text-4xl mb-6">Users</h6>
          <button className="border border-blue-500 text-blue-500 px-2 sm:px-4 py-1 sm:py-2 rounded">
            Add New User
          </button>
        </div>
        <div className="flex space-x-2 sm:space-x-4">
          <input
            type="text"
            placeholder="Search Users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-1 sm:p-2 rounded"
          />
          <button className="border border-blue-500 text-blue-500 px-2 sm:px-4 py-1 sm:py-2 rounded">
            Search Users
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-2 sm:px-4 py-1 sm:py-2">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedUsers(
                      e.target.checked ? users.map((user) => user.username) : []
                    )
                  }
                  checked={selectedUsers.length === users.length}
                />
              </th>
              <th className="border px-2 sm:px-4 py-1 sm:py-2">Username</th>
              <th className="border px-2 sm:px-4 py-1 sm:py-2">Name</th>
              <th className="border px-2 sm:px-4 py-1 sm:py-2">Email</th>
              <th className="border px-2 sm:px-4 py-1 sm:py-2">Role</th>
              <th className="border px-2 sm:px-4 py-1 sm:py-2">Posts</th>
              <th className="border px-2 sm:px-4 py-1 sm:py-2">Views</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.username} className="hover:bg-gray-100 group">
                <td className="border px-2 sm:px-4 py-1 sm:py-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.username)}
                    onChange={() => handleSelectUser(user.username)}
                  />
                </td>
                <td className="border px-2 sm:px-4 py-1 sm:py-2">
                  <div className="flex flex-col">
                    <span>{user.username}</span>
                    <div className="hidden group-hover:flex flex-col space-y-1 mt-2">
                      <div className="flex space-x-2">
                        <button className="text-blue-500">Edit</button>
                        <button className="text-red-500">Delete</button>
                        <button className="text-green-500">View</button>
                      </div>
                      <button
                        onClick={() => handleSendPasswordReset(user.email)}
                        className="text-blue-500"
                      >
                        Send Password Reset
                      </button>
                    </div>
                  </div>
                </td>
                <td className="border px-2 sm:px-4 py-1 sm:py-2">
                  {user.name}
                </td>
                <td className="border px-2 sm:px-4 py-1 sm:py-2">
                  {user.email}
                </td>
                <td className="border px-2 sm:px-4 py-1 sm:py-2">
                  {user.role}
                </td>
                <td className="border px-2 sm:px-4 py-1 sm:py-2">
                  {user.posts}
                </td>
                <td className="border px-2 sm:px-4 py-1 sm:py-2">
                  {user.views}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th className="border px-2 sm:px-4 py-1 sm:py-2">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedUsers(
                      e.target.checked ? users.map((user) => user.username) : []
                    )
                  }
                  checked={selectedUsers.length === users.length}
                />
              </th>
              <th className="border px-2 sm:px-4 py-1 sm:py-2">Username</th>
              <th className="border px-2 sm:px-4 py-1 sm:py-2">Name</th>
              <th className="border px-2 sm:px-4 py-1 sm:py-2">Email</th>
              <th className="border px-2 sm:px-4 py-1 sm:py-2">Role</th>
              <th className="border px-2 sm:px-4 py-1 sm:py-2">Posts</th>
              <th className="border px-2 sm:px-4 py-1 sm:py-2">Views</th>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="flex flex-wrap justify-between mt-4">
        <div className="mb-4">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="border p-1 sm:p-2 rounded mr-2"
          >
            <option value="">Bulk actions</option>
            <option value="delete">Delete</option>
            <option value="deactivate">Deactivate</option>
          </select>
          <button
            onClick={handleBulkAction}
            className="border border-blue-500 text-blue-500 p-1 sm:p-2 rounded"
          >
            Apply
          </button>
        </div>
        <div>
          <select
            value={roleChange}
            onChange={(e) => setRoleChange(e.target.value)}
            className="border p-1 sm:p-2 rounded mr-2"
          >
            <option value="">Change role to...</option>
            <option value="administrator">Administrator</option>
            <option value="editor">Editor</option>
            <option value="author">Author</option>
            <option value="contributor">Contributor</option>
            <option value="subscriber">Subscriber</option>
          </select>
          <button
            onClick={handleRoleChange}
            className="border border-blue-500 text-blue-500 p-1 sm:p-2 rounded"
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
