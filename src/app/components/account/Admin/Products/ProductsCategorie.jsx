// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { selectToken } from "../../../../redux-store/authenticationSlice";
// import { useSelector } from "react-redux";
// import CategorieDeleteButton from "./CategorieDeleteButton";
// import CategorieUpdateButton from "./CategorieUpdateButton.jsx";
// import Modal from "react-modal";

// const ProductsCategorie = () => {
//   const [parentTypes, setParentTypes] = useState([]);
//   const token = useSelector(selectToken);
//   const [types, setTypes] = useState([]);
//   const [message, setMessage] = useState(null);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [, forceUpdate] = React.useState();
//   const [newProductData, setNewProductData] = useState({
//     idType: "",
//     typeName: "",
//   });
//   const [newTypeData, setNewTypeData] = useState({
//     typeName: "",
//     parent_id: null,
//   });

//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const typesResponse = await axios.get(
//           "https://localhost:8000/api/types",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setTypes(typesResponse.data);

//         // Filtrer les types avec parent_id null
//         const parentTypes = typesResponse.data.filter(
//           (type) => type.parent_id === null
//         );
//         setParentTypes(parentTypes);
//       } catch (error) {
//         // Gérer les erreurs
//       }
//     };

//     fetchData();
//   }, [token, isAddModalOpen]);

//   const handleTypeDeleted = async ({ productId }) => {
//     try {
//       await axios.delete(`https://localhost:8000/api/types/${productId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       // Mettez à jour l'état local pour refléter la suppression du type
//       setTypes((prevTypes) =>
//         prevTypes.filter((type) => type.idType !== productId)
//       );
//       setMessage(`Type ${productId} supprimé avec succès.`);
//     } catch (error) {
//     } finally {
//       handleReloadTypes(); // Recharger la liste des types
//     }
//   };

//   const handleTypeUpdated = async ({ productId, updatedProductData }) => {
//     try {
//       await axios.put(
//         `https://localhost:8000/api/types/${productId}`,
//         updatedProductData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setMessage("Le type a été mis à jour avec succès.");
//     } catch (error) {
//     } finally {
//       setIsAddModalOpen(false); // Fermer la modal
//       handleReloadTypes(); // Recharger la liste des types
//     }
//   };

//   const handleTypeAdded = () => {
//     setIsAddModalOpen(false); // Fermer la modal
//     refreshTypes(); // Recharger la liste des types
//   };

//   const handleNewProduct = () => {
//     setIsAddModalOpen(true);
//     resetFilePreview(); // Réinitialise l'aperçu du fichier lorsque la modal est ouverte
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewTypeData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // const handleAddType = async () => {
//   //   try {
//   //     const response = await axios.post(
//   //       "https://localhost:8000/api/types",
//   //       JSON.stringify(newTypeData),
//   //       {
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //       }
//   //     );

//   //     setTypes((prevTypes) => [...prevTypes, response.data]);
//   //     setMessage("Nouveau type créé avec succès.");
//   //   } catch (error) {
//   //   } finally {
//   //     setIsAddModalOpen(false); // Fermer la modal
//   //   }
//   // };



//   const handleAddType = async () => {
//     try {
//       const response = await axios.post(
//         "https://localhost:8000/api/types",
//         JSON.stringify(newTypeData),
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
  
//       setTypes((prevTypes) => [...prevTypes, response.data]);
//       setMessage("Nouveau type créé avec succès.");
//     } catch (error) {
//       console.error("Erreur lors de la création du type :", error);
//       setMessage("Erreur lors de la création du type.");
//     } finally {
//       setIsAddModalOpen(false); // Fermer la modal
//     }
//   };
  
//   const handleTypesReload = (reloadedTypes) => {
//     setTypes(reloadedTypes);
//   };

//   const handleCheckboxChange = (productId) => {
//     setSelectedProducts((prevSelected) => {
//       if (prevSelected.includes(productId)) {
//         return prevSelected.filter((id) => id !== productId);
//       } else {
//         return [...prevSelected, productId];
//       }
//     });
//   };

//   const refreshTypes = async () => {
//     try {
//       const typesResponse = await axios.get(
//         "https://localhost:8000/api/types",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setTypes(typesResponse.data);
//     } catch (error) {
//     }
//   };

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const resetFilePreview = () => {
//     setSelectedFile(null);
//   };

//   const handleDeleteButtonClick = async () => {
//     try {
//       const response = await axios.delete(
//         "https://localhost:8000/api/types",
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           data: { selectedProducts },
//         }
//       );

//       // Mettez à jour l'état ou effectuez d'autres actions si nécessaire
//       console.log(response.data);
//     } catch (error) {
//     } finally {
//       handleReloadTypes(); // Recharge la liste des types
//     }
//   };

//   const handleReloadTypes = async () => {
//     try {
//       console.log("Reloading types...");
//       const typesResponse = await axios.get(
//         "https://localhost:8000/api/types",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setTypes(typesResponse.data);
//     } catch (error) {
//     }
//   };

//   return (
//     <div className="md:col-span-3 p-4 overflow-scroll max-h-[100vh]">
//       <h1 className="text-2xl mb-10 font-bold">
//         Administration - Liste des catégories
//       </h1>

//       <div className="mb-4">
//         <button
//           onClick={() => {
//             setIsAddModalOpen(true);
//             resetFilePreview();
//           }}
//           className="bg-green-500 text-white p-2 rounded hover:bg-green-600 mr-2"
//         >
//           Nouveau
//         </button>

//         <button
//           onClick={handleDeleteButtonClick}
//           className={`ml-4 p-2 rounded ${
//             selectedProducts.length > 0
//               ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
//               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//           }`}
//           disabled={selectedProducts.length === 0}
//         >
//           Supprimer
//         </button>
//       </div>

//       {message && <p>{message}</p>}
//       <table className="w-full border-collapse">
//         <thead>
//           <tr className="border-b border-t-2 border-customDark">
//             <th className="min-w-1/12 p-2 text-left">
//               <input
//                 type="checkbox"
//                 onChange={(e) => {
//                   if (e.target.checked) {
//                     setSelectedProducts(
//                       types
//                         .filter((type) => type.parent_id !== null)
//                         .map((type) => type.idType)
//                     );
//                   } else {
//                     setSelectedProducts([]);
//                   }
//                 }}
//               />
//             </th>
            
//             <th className="min-w-1/3 p-2 text-left">Nom</th>
//             <th className="min-w-1/3 p-2 text-left">Catégorie</th>
//             <th className="min-w-1/2 p-2 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {types
//             .filter((type) => type.parent_id === null)
//             .map((type) => (
//               <tr key={type.idType}>
//                 <td className="p-2">
//                   <input
//                     type="checkbox"
//                     onChange={() => handleCheckboxChange(type.idType)}
//                     checked={selectedProducts.includes(type.idType)}
//                   />
//                 </td>
                
//                 <td className="p-2">{type.Nom}</td>
//                 {/* Ajoutez la colonne pour afficher le nom de la catégorie parente */}
//                 <td className="p-2">
//                   {type.parent_id ? (
//                     (() => {
//                       const parentType = types.find(
//                         (t) => t.idType === type.parent_id
//                       );

//                       return parentType
//                         ? `${parentType.Nom}`
//                         : "Type introuvable";
//                     })()
//                   ) : (
//                     "Aucune catégorie parente"
//                   )}
//                 </td>

//                 <td className="align-middle text-center p-2">
//                   <div className="flex items-center space-x-2">
//                     <CategorieUpdateButton
//                       productId={type.idType}
//                       onTypeUpdated={handleTypeUpdated}
//                       refreshTypes={refreshTypes}
//                     />
//                     <CategorieDeleteButton
//                       key3={type.idType}
//                       productId={type.idType}
//                       onTypeDeleted={handleTypeDeleted}
//                     />
//                   </div>
//                 </td>
//               </tr>
//             ))}
//         </tbody>
//       </table>

//       <Modal
//         isOpen={isAddModalOpen}
//         onRequestClose={() => {
//           setIsAddModalOpen(false);
//           resetFilePreview(); // Réinitialise l'aperçu du fichier lorsque la modal est fermée
//           handleReloadTypes(); // Recharge les types lors de la fermeture de la modal
//         }}
//         contentLabel="Modal d'ajout d'un nouveau type"
//         style={{
//           // ... (styles de la modal)
//         }}
//       >
//         {/* Colonne gauche */}
//         <div
//           style={{ flex: 1, marginRight: "20px", width: "33%", margin: "0 auto" }}
//         >
//           <div style={{ margin: "20px" }}>
//             <a
//               href="#"
//               onClick={() => setIsAddModalOpen(false)}
//               className="text-blue-500 underline mb-4"
//             >
//               Retour sur Administration - Liste des catégories
//             </a>

//             <p
//               className="text-xl font-bold mb-4"
//               style={{
//                 marginTop: "45px",
//                 marginBottom: "27px",
//               }}
//             >
//               Ajouter une nouvelle catégorie
//             </p>

//             <hr
//               style={{
//                 marginBottom: "20px",
//                 borderTop: "2px solid #ccc",
//               }}
//             />

//             <div style={{ marginBottom: "7px" }}>
//               <label>Nom de la catégorie</label>
//             </div>
//             <div style={{ marginBottom: "20px" }}>
//               <input
//                 type="text"
//                 name="typeName" 
//                 style={{ width: "100%" }}
//                 onChange={handleInputChange}
//               />
//             </div>

            

           



//           </div>
//         </div>

//         {/* les boutons */}
//         <div
//           style={{
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             marginTop: "100px",
//           }}
//         >
//           {/* Boutons Annuler et Créer ce type */}
//           <div
//             className="flex mt-4 justify-center"
//             style={{ width: "100%", marginTop: "0px" }}
//           >
//             <button
//               onClick={() => {
//                 setIsAddModalOpen(false);
//                 resetFilePreview();
//               }}
//               className="bg-gray-400 text-white p-2 rounded mr-2 hover:bg-gray-500"
//             >
//               Annuler
//             </button>
//             <button
//               onClick={() => handleAddType()}
//               className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
//             >
//               Créer cette catégorie
//             </button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default ProductsCategorie;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { selectToken } from "../../../../redux-store/authenticationSlice";
import { useSelector } from "react-redux";
import CategorieDeleteButton from "./CategorieDeleteButton";
import CategorieUpdateButton from "./CategorieUpdateButton.jsx";
import Modal from "react-modal";

const ProductsCategorie = () => {
  const [types, setTypes] = useState([]);
  const token = useSelector(selectToken);
  const [message, setMessage] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTypeData, setNewTypeData] = useState({
    typeName: "",
    parent_id: null,
  });
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const typesResponse = await axios.get(
          "https://localhost:8000/api/types",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTypes(typesResponse.data);
      } catch (error) {
        // Gérer les erreurs
      }
    };

    fetchData();
  }, [token, isAddModalOpen]);

  const handleTypeDeleted = async ({ productId }) => {
    try {
      await axios.delete(`https://localhost:8000/api/types/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTypes((prevTypes) =>
        prevTypes.filter((type) => type.idType !== productId)
      );
      setMessage(`Type ${productId} supprimé avec succès.`);
    } catch (error) {
      // Gérer les erreurs
    } finally {
      handleReloadTypes();
    }
  };

  const handleTypeUpdated = async ({ productId, updatedProductData }) => {
    try {
      await axios.put(
        `https://localhost:8000/api/types/${productId}`,
        updatedProductData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Le type a été mis à jour avec succès.");
    } catch (error) {
      // Gérer les erreurs
    } finally {
      setIsAddModalOpen(false);
      handleReloadTypes();
    }
  };

  const handleAddType = async () => {
    try {
      const response = await axios.post(
        "https://localhost:8000/api/types",
        JSON.stringify(newTypeData),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTypes((prevTypes) => [...prevTypes, response.data]);
      setMessage("Nouveau type créé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la création du type :", error);
      setMessage("Erreur lors de la création du type.");
    } finally {
      setIsAddModalOpen(false);
    }
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter((id) => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };

  const handleDeleteButtonClick = async () => {
    try {
      await axios.delete("https://localhost:8000/api/types", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { selectedProducts },
      });

      console.log("Suppression réussie");
    } catch (error) {
      // Gérer les erreurs
    } finally {
      handleReloadTypes();
    }
  };

  const handleReloadTypes = async () => {
    try {
      const typesResponse = await axios.get(
        "https://localhost:8000/api/types",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTypes(typesResponse.data);
    } catch (error) {
      // Gérer les erreurs
    }
  };

  return (
    <div className="md:col-span-3 p-4 overflow-scroll max-h-[100vh]">
      <h1 className="text-2xl mb-10 font-bold">
        Administration - Liste des catégories
      </h1>

      <div className="mb-4">
        <button
          onClick={() => {
            setIsAddModalOpen(true);
          }}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 mr-2"
        >
          Nouveau
        </button>

        <button
          onClick={handleDeleteButtonClick}
          className={`ml-4 p-2 rounded ${
            selectedProducts.length > 0
              ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={selectedProducts.length === 0}
        >
          Supprimer
        </button>
      </div>

      {message && <p>{message}</p>}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-t-2 border-customDark">
            <th className="min-w-1/12 p-2 text-left">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedProducts(
                      types
                        .filter((type) => type.parent_id !== null)
                        .map((type) => type.idType)
                    );
                  } else {
                    setSelectedProducts([]);
                  }
                }}
              />
            </th>
            <th className="min-w-1/3 p-2 text-left">Nom</th>
            <th className="min-w-1/2 p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {types
            .filter((type) => type.parent_id === null)
            .map((type) => (
              <tr key={type.idType}>
                <td className="p-2">
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(type.idType)}
                    checked={selectedProducts.includes(type.idType)}
                  />
                </td>
                <td className="p-2">{type.Nom}</td>
                
                <td className="align-middle text-center p-2">
                  <div className="flex items-center space-x-2">
                    <CategorieUpdateButton
                      productId={type.idType}
                      onTypeUpdated={handleTypeUpdated}
                      refreshTypes={handleReloadTypes}
                    />
                    <CategorieDeleteButton
                      key3={type.idType}
                      productId={type.idType}
                      onTypeDeleted={handleTypeDeleted}
                    />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => {
          setIsAddModalOpen(false);
        }}
        contentLabel="Modal d'ajout d'un nouveau type"
      >
        <div style={{ margin: "20px" }}>
          <a
            href="#"
            onClick={() => setIsAddModalOpen(false)}
            className="text-blue-500 underline mb-4"
          >
            Retour sur Administration - Liste des catégories
          </a>
          <p className="text-xl font-bold mb-4">Ajouter une nouvelle catégorie</p>
          <hr style={{ marginBottom: "20px", borderTop: "2px solid #ccc" }} />
          <div style={{ marginBottom: "7px" }}>
            <label>Nom de la catégorie</label>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              name="typeName"
              style={{ width: "100%" }}
              onChange={(e) =>
                setNewTypeData((prevData) => ({
                  ...prevData,
                  [e.target.name]: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <div className="flex mt-4 justify-center" style={{ width: "100%" }}>
          <button
            onClick={() => {
              setIsAddModalOpen(false);
            }}
            className="bg-gray-400 text-white p-2 rounded mr-2 hover:bg-gray-500"
          >
            Annuler
          </button>
          <button
            onClick={() => handleAddType()}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Créer cette catégorie
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductsCategorie;