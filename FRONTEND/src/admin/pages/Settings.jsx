import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Settings.css'
import { showSuccess, showError, showConfirm } from '../../utils/toastUtils'
import API_BASE_URL from '../../utils/api.config'

const Settings = () => {
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(false)
  const [copying, setCopying] = useState(null)
  const [revoking, setRevoking] = useState(null)
  const [invitedEmail, setInvitedEmail] = useState('')
  const adminEmail = localStorage.getItem("adminData") ? JSON.parse(localStorage.getItem("adminData")).email : null

  useEffect(() => {
    if (adminEmail) {
      fetchPendingInvitations()
    }
  }, [adminEmail])

  const fetchPendingInvitations = () => {
    if (!adminEmail) {
      console.error("Admin email not found")
      showError("Error: Admin email not found. Please log in again.")
      return
    }

    setLoading(true)
    axios.get(`${API_BASE_URL}/user/admin/pending-invitations`, {
      headers: { 'x-admin-email': adminEmail }
    })
      .then((response) => {
        setInvitations(response.data.invitations || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching invitations:", error)
        showError("Failed to load invitations: " + (error.response?.data?.message || error.message))
        setLoading(false)
      })
  }

  const createNewInvitation = () => {
    // Validate email if provided
    if (invitedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invitedEmail)) {
      showError("Please enter a valid email address")
      return
    }

    setLoading(true)
    axios.post(`${API_BASE_URL}/user/admin/create-invitation`, 
      { invitedEmail },
      { headers: { 'x-admin-email': adminEmail } }
    )
      .then((response) => {
        if (response.data.emailSent) {
          showSuccess(`Invitation sent to ${invitedEmail}!`)
        } else if (invitedEmail) {
          showSuccess("Invitation created! Email failed - share the link manually.")
          navigator.clipboard.writeText(response.data.invitationLink)
        } else {
          showSuccess("Invitation created! Link copied to clipboard.")
          navigator.clipboard.writeText(response.data.invitationLink)
        }
        
        setInvitedEmail('')
        fetchPendingInvitations()
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error creating invitation:", error)
        showError("Failed to create invitation: " + (error.response?.data?.message || error.message))
        setLoading(false)
      })
  }

  const copyToClipboard = (invitationToken) => {
    setCopying(invitationToken)
    const link = `${window.location.origin}/admin/signup?token=${invitationToken}`
    navigator.clipboard.writeText(link)
      .then(() => {
        showSuccess("Invitation link copied to clipboard!")
        setCopying(null)
      })
      .catch((error) => {
        showError("Failed to copy to clipboard")
        setCopying(null)
      })
  }

  const revokeInvitation = (token) => {
    showConfirm("Revoke Invitation?", "Are you sure you want to revoke this invitation? This action cannot be undone.", "Revoke", "Cancel")
      .then((result) => {
        if (result.isConfirmed) {
          setRevoking(token)
          axios.post(`${API_BASE_URL}/user/admin/revoke-invitation`, 
            { token, adminEmail },
            { headers: { 'x-admin-email': adminEmail } }
          )
            .then((response) => {
              showSuccess("Invitation revoked successfully")
              fetchPendingInvitations()
              setRevoking(null)
            })
            .catch((error) => {
              console.error("Error revoking invitation:", error)
              showError("Failed to revoke invitation: " + (error.response?.data?.message || error.message))
              setRevoking(null)
            })
        }
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

        <div className='invitation-form mb-4'>
          <div className='row align-items-end'>
            <div className='col-md-8'>
              <label htmlFor='invitedEmail' className='form-label fw-500'>
                Email Address (Optional)
              </label>
              <input
                type='email'
                id='invitedEmail'
                className='form-control'
                placeholder='Enter the email of the person to invite'
                value={invitedEmail}
                onChange={(e) => setInvitedEmail(e.target.value)}
                disabled={loading}
              />
              <small className='text-muted'>If you provide an email, the invitation link will be sent automatically. Leave empty to create a general invitation link.</small>
            </div>
            <div className='col-md-4'>
              <button 
                className='btn btn-primary w-100' 
                onClick={createNewInvitation}
                disabled={loading}
              >
                {loading ? 'Creating...' : '+ Create Invitation'}
              </button>
            </div>
          </div>
        </div>

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
            <li><strong>Option 1 - Send via Email (Recommended):</strong> Enter the email address of the person you want to invite and click "Create Invitation". The invitation link will be automatically sent to their email.</li>
            <li><strong>Option 2 - Share Manually:</strong> Leave the email field empty and the invitation link will be copied to your clipboard. Share it however you prefer.</li>
            <li>The invited person receives the link and clicks it to sign up as admin</li>
            <li>The invitation is automatically marked as accepted when they sign up</li>
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