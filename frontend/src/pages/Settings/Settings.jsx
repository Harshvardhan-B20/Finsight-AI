import {
  ArrowLeft,
  LogOut,
  Settings as SettingsIcon,
  User,
  Mail,
  Wallet,
  X,
  Save,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [userName, setUserName] = useState(
    storedUser.name || "User"
  );

  const [userEmail, setUserEmail] = useState(
    storedUser.email || ""
  );

  const [accountType, setAccountType] = useState(
    storedUser.account_type || "Finance Admin"
  );

  const [showProfile, setShowProfile] = useState(false);

  const [editName, setEditName] = useState(
    storedUser.name || ""
  );

  const [editEmail, setEditEmail] = useState(
    storedUser.email || ""
  );

  const [editAccountType, setEditAccountType] = useState(
    storedUser.account_type || "Finance Admin"
  );

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // ========================================
  // PROFILE MODAL
  // ========================================

  const openProfileModal = () => {
    setEditName(userName);
    setEditEmail(userEmail);
    setEditAccountType(accountType);

    setProfileError("");
    setProfileSuccess("");
    setShowProfile(true);
  };

  const closeProfileModal = () => {
    if (savingProfile) return;

    setShowProfile(false);
    setProfileError("");
    setProfileSuccess("");
  };

  // ========================================
  // SAVE PROFILE
  // ========================================

  const handleProfileSave = async () => {
    const trimmedName = editName.trim();
    const trimmedEmail = editEmail.trim().toLowerCase();
    const trimmedAccountType = editAccountType.trim();

    if (!trimmedName) {
      setProfileError("Name is required.");
      return;
    }

    if (!trimmedEmail) {
      setProfileError("Email is required.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setProfileError("Please enter a valid email address.");
      return;
    }

    if (!trimmedAccountType) {
      setProfileError("Account type is required.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setProfileError(
        "Authentication token not found. Please login again."
      );
      return;
    }

    setSavingProfile(true);
    setProfileError("");
    setProfileSuccess("");

    try {
      const response = await fetch(
        "http://127.0.0.1:5100/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            account_type: trimmedAccountType,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile."
        );
      }

      const updatedUser = {
        ...storedUser,
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        account_type: data.user.account_type,
        created_at: data.user.created_at,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setUserName(data.user.name);
      setUserEmail(data.user.email);
      setAccountType(
        data.user.account_type || "Finance Admin"
      );

      setEditName(data.user.name);
      setEditEmail(data.user.email);
      setEditAccountType(
        data.user.account_type || "Finance Admin"
      );

      setProfileSuccess(
        "Profile updated successfully."
      );

      setTimeout(() => {
        setShowProfile(false);
        setProfileSuccess("");
      }, 700);
    } catch (error) {
      console.error("Profile update error:", error);

      setProfileError(
        error.message || "Unable to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="settings-page">

      {/* ========================================
          HEADER
          ======================================== */}

      <header className="settings-header">

        <div className="settings-header-left">

          <button
            type="button"
            className="settings-back-button"
            onClick={() => navigate("/dashboard")}
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <p className="settings-label">
              ACCOUNT MANAGEMENT
            </p>

            <h1>Settings</h1>

            <p>
              Manage your account and application preferences.
            </p>
          </div>

        </div>

      </header>

      {/* ========================================
          SETTINGS CARD
          ======================================== */}

      <div className="settings-card">

        <div className="settings-section-title">
          <SettingsIcon size={20} />

          <div>
            <h2>Account Settings</h2>

            <p>
              Your FinSight account information
            </p>
          </div>
        </div>

        {/* PROFILE */}

        <div
          className="settings-row settings-clickable"
          onClick={openProfileModal}
        >
          <div className="settings-info">

            <div className="settings-icon">
              <User size={18} />
            </div>

            <div>
              <strong>Profile</strong>

              <span>
                Manage your FinSight account information.
              </span>
            </div>

          </div>

          <div className="settings-value">
            <strong>{userName}</strong>
            <span>{accountType}</span>
          </div>
        </div>

        {/* EMAIL */}

        <div className="settings-row">

          <div className="settings-info">

            <div className="settings-icon">
              <Mail size={18} />
            </div>

            <div>
              <strong>Email</strong>

              <span>
                Your registered account email.
              </span>
            </div>

          </div>

          <div className="settings-value">
            {userEmail || "Not available"}
          </div>

        </div>

        {/* CURRENCY */}

        <div className="settings-row">

          <div className="settings-info">

            <div className="settings-icon">
              <Wallet size={18} />
            </div>

            <div>
              <strong>Currency</strong>

              <span>
                Currency used throughout FinSight.
              </span>
            </div>

          </div>

          <div className="settings-value">
            INR (₹)
          </div>

        </div>

        {/* ACCOUNT TYPE */}

        <div className="settings-row">

          <div className="settings-info">

            <div className="settings-icon">
              <User size={18} />
            </div>

            <div>
              <strong>Account Type</strong>

              <span>
                Your current FinSight access level.
              </span>
            </div>

          </div>

          <div className="settings-value">
            {accountType}
          </div>

        </div>

        {/* SESSION */}

        <div className="settings-row">

          <div className="settings-info">

            <div className="settings-icon">
              <LogOut size={18} />
            </div>

            <div>
              <strong>Session</strong>

              <span>
                Sign out of your current FinSight account.
              </span>
            </div>

          </div>

          <button
            className="settings-logout"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </button>

        </div>

      </div>

      {/* ========================================
          PROFILE MODAL
          ======================================== */}

      {showProfile && (
        <div
          className="settings-modal-overlay"
          onClick={closeProfileModal}
        >
          <div
            className="settings-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="settings-modal-header">

              <div>
                <h2>Edit Profile</h2>

                <p>
                  Update your FinSight profile information.
                </p>
              </div>

              <button
                type="button"
                className="settings-modal-close"
                onClick={closeProfileModal}
                disabled={savingProfile}
              >
                <X size={19} />
              </button>

            </div>

            <div className="settings-form">

              <label>
                Name

                <input
                  type="text"
                  value={editName}
                  onChange={(event) =>
                    setEditName(event.target.value)
                  }
                  placeholder="Enter your name"
                  autoFocus
                  disabled={savingProfile}
                />
              </label>

              <label>
                Email

                <input
                  type="email"
                  value={editEmail}
                  onChange={(event) =>
                    setEditEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  disabled={savingProfile}
                />
              </label>

              <label>
                Account Type

                <select
                  value={editAccountType}
                  onChange={(event) =>
                    setEditAccountType(
                      event.target.value
                    )
                  }
                  disabled={savingProfile}
                >
                  <option value="Finance Admin">
                    Finance Admin
                  </option>

                  <option value="Business Owner">
                    Business Owner
                  </option>

                  <option value="Finance Manager">
                    Finance Manager
                  </option>

                  <option value="Accountant">
                    Accountant
                  </option>
                </select>
              </label>

              {profileError && (
                <div className="profile-error">
                  {profileError}
                </div>
              )}

              {profileSuccess && (
                <div className="profile-success">
                  {profileSuccess}
                </div>
              )}

              <button
                type="button"
                className="settings-save-button"
                onClick={handleProfileSave}
                disabled={
                  savingProfile ||
                  !editName.trim() ||
                  !editEmail.trim() ||
                  !editAccountType.trim()
                }
              >
                <Save size={16} />

                {savingProfile
                  ? "Saving Changes..."
                  : "Save Changes"}
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Settings;