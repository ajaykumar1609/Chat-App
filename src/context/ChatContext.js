import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";


export const ChatContext = createContext()

export const ChatContextProvider = ({ children }) => {
    const {currentUser} = useContext(AuthContext)
    const INITIAL_STATE = {
        chatId:"ajay",
        user:""
    }
    const chatReducer = (state,action)=>{
        switch(action.type){
            case "CHANGE_USER":
                return{
                    user: action.payload,
                    chatId : currentUser.uid > action.payload.uid
                    ? currentUser.uid + action.payload.uid
                    : action.payload.uid + currentUser.uid
                }
            default:
        }
    }
    const [state,dispatch] = useReducer(chatReducer,INITIAL_STATE)
    return (
      <ChatContext.Provider value={{ data:state,dispatch }}>
        {children}
      </ChatContext.Provider>
    );
  };

// import { createContext, useContext, useReducer } from "react";
// import { AuthContext } from "./AuthContext";
// import JSEncrypt from "jsencrypt";

// export const ChatContext = createContext();

// export const ChatContextProvider = ({ children }) => {
//   const { currentUser } = useContext(AuthContext);

//   const chatReducer = (state, action) => {
//     switch (action.type) {
//       case "CHANGE_USER": {
//         const chatId =
//           currentUser.uid > action.payload.uid
//             ? currentUser.uid + action.payload.uid
//             : action.payload.uid + currentUser.uid;

//         // Check if the key pair for this chatId already exists in the state
//         if (state.keyPairs[chatId]) {
//           return {
//             user: action.payload,
//             chatId,
//             keyPairs: state.keyPairs, // No need to regenerate the key pairs
//           };
//         }

//         // Generate a new RSA key pair (public and private keys) for the chat
//         const encryptor = new JSEncrypt();
//         encryptor.getKey();

//         // Get the public key to share with others (e.g., for encryption)
//         const publicKey = encryptor.getPublicKey();

//         // Get the private key to keep securely (e.g., for decryption)
//         const privateKey = encryptor.getPrivateKey();

//         // Update the state with the new key pair for the chatId
//         return {
//           user: action.payload,
//           chatId,
//           keyPairs: {
//             ...state.keyPairs,
//             [chatId]: {
//               publicKey,
//               privateKey,
//             },
//           },
//         };
//       }
//       default:
//         return state;
//     }
//   };

//   const INITIAL_STATE = {
//     chatId: "ajay",
//     user: "",
//     keyPairs: {}, // Store the key pairs in a dictionary
//   };

//   const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

//   return (
//     <ChatContext.Provider value={{ data: state, dispatch }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };
