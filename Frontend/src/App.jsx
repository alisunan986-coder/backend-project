// Import the useState and useEffect hooks from React for state and side effects.
import { useState, useEffect } from 'react'

// Define the App component as the main React component for this page.
function App() {
  // users holds the array of user objects; setUsers updates that array.
  const [users, setUsers] = useState([])
  // name holds the current input text for a new user's name.
  const [name, setName] = useState('')
  // role holds the current input text for a new user's role.
  const [role, setRole] = useState('')

  // Load the user list once when the component mounts.
  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(res => res.json())
      .then(data => setUsers(data))
  }, [])

  // Handle form submission to create a new user on the backend.
  const handleSubmit = () => {
    // Do nothing if either input is empty.
    if (!name || !role) return

    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, role })
    })
      .then(res => res.json())
      .then(newUser => {
        // Add the new user to the displayed list.
        setUsers([...users, newUser])
        // Clear the input fields after successful submit.
        setName('')
        setRole('')
      })
  }

  // Render the user interface.
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      {/* Page heading for the user list. */}
      <h1>Users</h1>

      {/* Form container used to create a new user. */}
      <div style={{ marginBottom: '24px' }}>
        {/* Input for the user name. */}
        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ marginRight: '8px', padding: '8px' }}
        />
        {/* Input for the user role. */}
        <input
          placeholder="Role"
          value={role}
          onChange={e => setRole(e.target.value)}
          style={{ marginRight: '8px', padding: '8px' }}
        />
        {/* Button that submits the new user request. */}
        <button onClick={handleSubmit} style={{ padding: '8px 16px' }}>
          Add User
        </button>
      </div>

      {/* Render the list of users returned from the backend. */}
      {users.map(user => (
        <div key={user.id} style={{ padding: '12px', border: '1px solid #ddd', marginBottom: '8px', borderRadius: '8px' }}>
          {/* Display the user's name and role. */}
          <strong>{user.name}</strong> — {user.role}
        </div>
      ))}
    </div>
  )
}

// Export the App component as the default export of the module.
export default App