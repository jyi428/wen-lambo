import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, getFirestore, writeBatch } from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import { auth, googleAuthProvider } from "../config/firebase";
import { UserContext } from "../contexts/UserContext";

import debounce from "lodash.debounce";

const EnterPage = () => {
  const { user, username } = useContext(UserContext);

  const SignInButton = () => {
    const signInWithGoogle = async () => {
      await signInWithPopup(auth, googleAuthProvider);
    };

    return (
      <main>
        <button className="btn-google" onClick={signInWithGoogle}>
          <img src={"/google.png"} width="25px" /> Sign in with Google{" "}
        </button>
        <Loader show={true} />
      </main>
    );
  };

  const UsernameForm = () => {
    const [formValue, setFormValue] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    useEffect(() => {
      checkUsername(formValue);
    }, [formValue]);

    const handleOnSubmit = async (e) => {
      e.preventDefault();

      // Create refs for both documents
      const userDoc = doc(getFirestore(), "users", user.uid);
      const usernameDoc = doc(getFirestore(), "usernames", formValue);

      // Commit both docs together as a batch write.
      const batch = writeBatch(getFirestore());
      batch.set(userDoc, {
        username: formValue,
        photoURL: user.photoURL,
        displayName: user.displayName,
      });
      batch.set(usernameDoc, { uid: user.uid });

      await batch.commit();
    };

    const handleOnChange = (e) => {
      const val = e.target.value.toLowerCase();
      const validInput = /^[A-Za-z0-9_-]*$/;

      if (val.length < 5) {
        setFormValue(val);
        setLoading(false);
        setIsValid(false);
      }

      if (validInput.test(val)) {
        setFormValue(val);
        setLoading(true);
        setIsValid(false);
      }
    };

    // executes when last value updated after a delay 500 ms
    // useCallback allows this fn to be memoized so it can be debounced
    const checkUsername = useCallback(
      debounce(async (username) => {
        if (username.length >= 3) {
          const ref = doc(getFirestore(), "usernames", username);
          const snap = await getDoc(ref);
          console.log("Firestore read executed!", snap.exists());
          setIsValid(!snap.exists());
          setLoading(false);
        }
      }, 500),
      []
    );

    return (
      !username && (
        <div>
          <h3>Choose your Degen Username</h3>
          <input
            name="username"
            placeholder="myname"
            value={formValue}
            onChange={handleOnChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <form onSubmit={handleOnSubmit}>
            <button type="submit" className="btn-green" disabled={!isValid}>
              Choose
            </button>
          </form>
        </div>
      )
    );
  };

  const UsernameMessage = ({ isValid, loading, username }) => {
    if (loading) {
      return <p>Checking...</p>;
    } else if (isValid) {
      return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
      return <p className="text-danger">That username is taken!</p>;
    } else {
      return <p></p>;
    }
  };
  /*
  1. user signed out, <SignInButton />
  2. user signed in, but missing username <UsernameForm />
  3. user signed in, has username <SignOutButton />
  */
  return (
    <main>
      {user ? !username && <UsernameForm /> : <SignInButton />}

      {username ? (
        <div className="box-center">
          Click "Post" to start or checkout the lambo{" "}
          <img src={"doge.jpg"} className="doge" />
          <Loader show={true} />
        </div>
      ) : (
        ""
      )}
    </main>
  );
};

export default EnterPage;
