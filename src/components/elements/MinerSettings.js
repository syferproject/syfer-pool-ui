import { useContext, useEffect, useState } from 'react';
import { useFormInput } from '../../helpers/hooks';
import { AppContext } from '../ContextProvider';


const MinerSettings = () => {
  const { actions, state } = useContext(AppContext);
  const { changePassword, changePayoutThreshold, login, logout, toggleEmail } = actions;
  const { appSettings, user } = state;
  const { maximumPasswordLength, maximumPayoutThreshold, minimumPasswordLength, minimumPayoutThreshold } = appSettings;

  const { value: username, reset: resetUsername, bind: bindUsername } = useFormInput('');
  const { value: password, reset: resetPassword, bind: bindPassword } = useFormInput('');
  const { value: payoutThreshold, bind: bindPayoutThreshold, setValue: setPayoutThreshold } = useFormInput(user.payoutThreshold);
  const { value: newPassword, reset: resetNewPassword, bind: bindNewPassword } = useFormInput('');
  const { value: newPasswordConfirm, reset: resetNewPasswordConfirm, bind: bindNewPasswordConfirm } = useFormInput('');
  const [emailNotifications, setEmailNotifications] = useState(Boolean(user.emailEnabled));
  const [payoutThresholdMessage, setPayoutThresholdMessage] = useState('');
  const [emailNotificationsMessage, setEmailNotificationsMessage] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    if (user.loggedIn()) {
      resetUsername();
      resetPassword();
      setPayoutThreshold(user.payoutThreshold / Math.pow(10, appSettings.coinDecimals));
      setEmailNotifications(Boolean(user.emailEnabled));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleEmailNotifications = () => {
    setEmailNotifications(!emailNotifications);
  }

  useEffect(() => {
    // setPayoutThresholdMessage('');
    if (payoutThreshold < minimumPayoutThreshold) {
      setPayoutThresholdMessage(`Payout threshold can't be lower than ${minimumPayoutThreshold} CCX.`);
    }
    if (payoutThreshold > maximumPayoutThreshold) {
      setPayoutThresholdMessage(`Payout threshold can't be higher than ${maximumPayoutThreshold} CCX.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payoutThreshold]);

  useEffect(() => {
    setPasswordMessage('');
    if (newPassword.length > 0 && newPassword.length <= minimumPasswordLength) {
      setPasswordMessage(`Password must be longer than ${minimumPasswordLength} characters`);
    }
    if (newPassword.length > 0 && newPassword.length >= maximumPasswordLength) {
      setPasswordMessage(`Password must not be longer than ${maximumPasswordLength} characters`);
    }
    if (newPassword.length > 0 && newPasswordConfirm.length > 0 && newPassword !== newPasswordConfirm) {
      setPasswordMessage('Passwords don\'t match');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPassword, newPasswordConfirm])

  const showMessage = (element, msg) => {
    if (element === 'login') setLoginMessage(msg);
    if (element === 'payoutThreshold') setPayoutThresholdMessage(msg);
    if (element === 'emailNotifications') setEmailNotificationsMessage(msg);
    if (element === 'changePassword') setPasswordMessage(msg);
  }

  return (
    <div>
      <h3>Miner Settings</h3>
      <form
        onSubmit={e => {
          e.preventDefault();
          login(username, password, msg => showMessage('login', msg));
          showMessage('login', '');
        }}
        className={`${user.loggedIn() ? 'hidden' : ''}`}
      >
        <label>
          User name:
          <input
            {...bindUsername}
            type="text"
            name="username"
            placeholder="User name"
            aria-label="user-name"
          />
        </label>
        <label>
          Password:
          <input
            {...bindPassword}
            type="password"
            name="password"
            placeholder="Password"
            aria-label="password"
          />
        </label>
        <button
          type="submit"
        >
          Log in
        </button>
        <span>{loginMessage}</span>
      </form>
      {user.loggedIn()
        ? <div>
            <form
              onSubmit={e => {
                e.preventDefault();
                showMessage('payoutThreshold', '');
                (user.payoutThreshold !== payoutThreshold * Math.pow(10, appSettings.coinDecimals))
                  ? changePayoutThreshold(payoutThreshold, msg => showMessage('payoutThreshold', msg))
                  : showMessage('payoutThreshold', 'No change');
              }}
            >
              <div>
                <label>
                  Payout threshold:
                  <input
                    {...bindPayoutThreshold}
                    type="number"
                    name="threshold"
                    min={minimumPayoutThreshold}
                    max={maximumPayoutThreshold}
                    step={1}
                    placeholder={payoutThreshold}
                    aria-label="payout-threshold"
                  />
                </label> CCX
                <button
                  type="submit"
                  disabled={
                    (user.payoutThreshold === payoutThreshold * Math.pow(10, appSettings.coinDecimals)) ||
                    (payoutThreshold < minimumPayoutThreshold) || (payoutThreshold > maximumPayoutThreshold)
                  }
                >
                  Save
                </button>
                <span>{payoutThresholdMessage}</span>
              </div>
            </form>
            <form
              onSubmit={e => {
                e.preventDefault();
                showMessage('emailNotifications', '');
                (Boolean(user.emailEnabled) !== emailNotifications)
                  ? toggleEmail(msg => showMessage('emailNotifications', msg))
                  : showMessage('emailNotifications', 'No change');
              }}
            >
              <div>
                <label>
                  Email notifications:
                  <input
                    checked={emailNotifications}
                    onChange={handleEmailNotifications}
                    type="checkbox"
                    name="notifications"
                    aria-label="email-notifications"
                  />
                </label>
                <button type="submit">Save</button>
                <span>{emailNotificationsMessage}</span>
              </div>
            </form>
            <form
              onSubmit={e => {
                e.preventDefault();
                changePassword(newPassword, msg => {
                  showMessage('changePassword', msg);
                  resetNewPassword();
                  resetNewPasswordConfirm();
                });
              }}>
              <label>
                New password:
                <input
                  {...bindNewPassword}
                  type="password"
                  name="newpassword"
                  placeholder="New password"
                  aria-label="new-password"
                />
              </label>
              <label>
                Confirm new password:
                <input
                  {...bindNewPasswordConfirm}
                  type="password"
                  name="newpasswordconfirm"
                  placeholder="Confirm new password"
                  aria-label="new-password-confirm"
                />
              </label>
              <button
                type="submit"
                disabled={
                  (newPassword === '' || newPasswordConfirm === '') ||
                  (newPassword !== newPasswordConfirm) ||
                  (newPassword.length <= minimumPasswordLength) ||
                  (newPassword.length >= maximumPasswordLength)
                }
              >
                Save
              </button>
              <span>{passwordMessage}</span>
            </form>
            <button onClick={logout}>Logout</button>
          </div>
        : <div>log in</div>
      }
    </div>
  );
}

export default MinerSettings;
