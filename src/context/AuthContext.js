import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";


export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});
  
    useEffect(() => {
      const unsub = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        console.log(user);
      });
  
      return () => {
        unsub();
      };
    }, []);
  
    return (
      <AuthContext.Provider value={{ currentUser }}>
        {children}
      </AuthContext.Provider>
    );
  };
// import { createContext, useEffect, useState } from "react";
// import { auth } from "../firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { getDoc, doc } from "firebase/firestore";
// import { db } from "../firebase";

// export const AuthContext = createContext();

// export const AuthContextProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState({});

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         const userDocRef = doc(db, "users", user.uid);
//         const userDocSnapshot = await getDoc(userDocRef);
//         const userData = userDocSnapshot.data();
//         setCurrentUser({ ...user, ...userData });
//         console.log({ ...user, ...userData });
//       } else {
//         setCurrentUser(null);
//       }
//     });

//     return () => {
//       unsub();
//     };
//   }, []);

//   return (
//     <AuthContext.Provider value={{ currentUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
