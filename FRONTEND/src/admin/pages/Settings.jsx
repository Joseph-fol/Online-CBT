import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Settings.css'

const Settings = () => {
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(false)
  const [copying, setCopying] = useState(null)
  const [revoking, setRevoking] = useState(null)
  const adminEmail = localStorage.getItem("adminData") ? JSON.parse(localStorage.getItem("adminData")).email : null

  useEffect(() => {
    fetchPendingInvitations()
  }, [])

  const fetchPendingInvitations = () => {
    setLoading(true)
    axios.get('http://localhost:2114/admin/pending-invitations', {
      headers: { 'x-admin-email': adminEmail }
    })
      .then((response) => {
        setInvitations(response.data.invitations || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching invitations:", error)
        alert("Failed to load invitations")
        setLoading(false)
      })
  }

  const createNewInvitation = () => {
    setLoading(true)
    axios.post('http://localhost:2114/admin/create-invitation', 
      { adminEmail },
      { headers: { 'x-admin-email': adminEmail } }
    )
      .then((response) => {
        alert(`Invitation created! Link copied to clipboard.\n\n${response.data.invitationLink}`)
        
        // Copy to clipboard
        navigator.clipboard.writeText(response.data.invitationLink)
        
        // Refresh invitations list
        fetchPendingInvitations()
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error creating invitation:", error)
        alert("Failed to create invitation: " + (error.response?.data?.message || error.message))
        setLoading(false)
      })
  }

  const copyToClipboard = (invitationToken) => {
    setCopying(invitationToken)
    const link = `${window.location.origin}/admin/signup?token=${invitationToken}`
    navigator.clipboard.writeText(link)
      .then(() => {
        alert("Invitation link copied to clipboard!")
        setCopying(null)
      })
      .catch((error) => {
        alert("Failed to copy to clipboard")
        setCopying(null)
      })
  }

  const revokeInvitation = (token) => {
    if (!window.confirm("Are you sure you want to revoke this invitation?")) {
      return
    }

    setRevoking(token)
    axios.post('http://localhost:2114/admin/revoke-invitation', 
      { token, adminEmail },
      { headers: { 'x-admin-email': adminEmail } }
    )
      .then((response) => {
        alert("Invitation revoked successfully")
        fetchPendingInvitations()
        setRevoking(null)
      })
      .catch((error) => {
        console.error("Error revoking invitation:", error)
        alert("Failed to revoke invitation: " + (error.response?.data?.message || error.message))
        setRevoking(null)
      })
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString()
  }

  return (
    <div className='admin-page-card'>
      <h2>Settings</h2>
      
      {/* Admin Invitations Section */}
      <div className='settings-section mt-5'>
        <h4 className='fw-bold mb-4'>Admin Invitations</h4>
        <p className='text-muted'>Invite new administrators to the platform. Invitations expire after 7 days.</p>

        <button 
          className='btn btn-primary mb-4' 
          onClick={createNewInvitation}
          disabled={loading}
        >
          {loading ? 'Creating...' : '+ Create New Invitation'}
        </button>

        {invitations.length === 0 ? (
          <div className='alert alert-info'>
            No pending invitations. Create one to invite new admins.
          </div>
        ) : (
          <div className='table-responsive'>
            <table className='table table-hover'>
              <thead className='table-light'>
                <tr>
                  <th>Email</th>
                  <th>Created</th>
                  <th>Token</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((inv) => (
                  <tr key={inv.token}>
                    <td>
                      <span className='badge bg-info'>
                        {inv.invitedEmail || 'Open Invitation'}
                      </span>
                    </td>
                    <td className='small text-muted'>
                      {formatDate(inv.createdAt)}
                    </td>
                    <td>
                      <code className='small'>{inv.token.substring(0, 16)}...</code>
                    </td>
                    <td>
                      <button 
                        className='btn btn-sm btn-outline-primary me-2'
                        onClick={() => copyToClipboard(inv.token)}
                        disabled={copying === inv.token}
                      >
                        {copying === inv.token ? '✓ Copied' : 'Copy Link'}
                      </button>
                      <button 
                        className='btn btn-sm btn-outline-danger'
                        onClick={() => revokeInvitation(inv.token)}
                        disabled={revoking === inv.token}
                      >
                        {revoking === inv.token ? 'Revoking...' : 'Revoke'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className='alert alert-warning mt-4'>
          <strong>How to use:</strong>
          <ol className='mb-0 mt-2'>
            <li>Click "Create New Invitation" to generate a unique link</li>
            <li>Share the link with the person you want to invite as admin</li>
            <li>They click the link and sign up with their details</li>
            <li>The invitation is automatically marked as accepted</li>
            <li>You can revoke unused invitations anytime</li>
          </ol>
        </div>
      </div>

      {/* Other Settings */}
      <div className='settings-section mt-5 pt-4 border-top'>
        <h4 className='fw-bold mb-3'>Other Settings</h4>
        <p className='text-muted'>Configure other admin preferences and account settings here.</p>
      </div>
    </div>
  )
}

export default Settings