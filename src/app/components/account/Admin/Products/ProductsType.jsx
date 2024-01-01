
import React, { useEffect, useState } from "react";
import axios from "axios";
import { selectToken } from "../../../../redux-store/authenticationSlice";
import { useSelector } from "react-redux";
import TypeDeleteButton from "./TypeDeleteButton";
import TypeUpdateButton from "./TypeUpdateButton";
import Modal from "react-modal";

  const ProductsType = () => {
    
  const [parentTypes, setParentTypes] = useState([]);
  const token = useSelector(selectToken);
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [message, setMessage] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [, forceUpdate] = React.useState();
  const [newProductData, setNewProductData] = useState({
    idType: "",
    typeName: "",
  });
  const [newTypeData, setNewTypeData] = useState({
    typeName: "", // Définissez la valeur initiale comme une chaîne vide
    parent_id: null,
  });

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

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

        // Filtrer les types avec parent_id null
        const parentTypes = typesResponse.data.filter((type) => type.parent_id === null);
        setParentTypes(parentTypes);
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

      setTypes((prevTypes) => prevTypes.filter((type) => type.idType !== productId));
      setMessage(`Le type ${productId} a été supprimé avec succès.`);
    } catch (error) {
      console.error("Erreur lors de la suppression du type :", error);
      setMessage("Erreur lors de la suppression du type.");
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
    } finally {
      setIsAddModalOpen(false); // Fermer la modal
      handleReloadTypes(); // Recharger la liste des types
    }
   
  };



const handleTypeAdded = () => {
  setIsAddModalOpen(false); // Fermer la modal
  refreshTypes(); // Recharger la liste des types
};

const handleNewProduct = () => {
  setNewTypeData({
    typeName: "",
    parent_id: null
  });
  setIsAddModalOpen(true);
  resetFilePreview();
};
  
  


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTypeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  

  const handleAddType = async () => {
    try {
      if (!newTypeData.parent_id) {
        // Vérifiez si une catégorie a été choisie
        console.error("Veuillez choisir une catégorie.");
        setMessage("Veuillez choisir une catégorie.");
        return;
      }

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
      setMessage("Le nouveau type a été créé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la création du type :", error);
      setMessage("Erreur lors de la création du type.");
    } finally {
      setIsAddModalOpen(false);
    }
  };


const handleTypesReload = (reloadedTypes) => {
  setTypes(reloadedTypes);
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

  const refreshTypes = async () => {
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
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const resetFilePreview = () => {
    setSelectedFile(null);
  };

  const handleDeleteButtonClick = async () => {
    try {
      const response = await axios.delete(
        "https://localhost:8000/api/types",
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          data: { selectedProducts },
        }
      );
  
      // Mettez à jour l'état ou effectuez d'autres actions si nécessaire
      console.log(response.data);
    } catch (error) {
    }finally {
      handleReloadTypes(); // Recharge la liste des types
    }



  };
 
  const handleReloadTypes = async () => {
    try {
      console.log('Reloading types...');
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
    }
  };
  

  
  return (
    <div className="md:col-span-3 p-4 overflow-scroll max-h-[100vh]">
      <h1 className="text-2xl mb-10 font-bold">
        Administration - Liste des types
      </h1>

      <div className="mb-4">
  <button
    onClick={() => {
      setIsAddModalOpen(true);
      resetFilePreview();
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
            <th className="min-w-1/3 p-2 text-left">Catégorie</th>
            <th className="min-w-1/2 p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
  {types
    .filter((type) => type.parent_id !== null)
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
        {/* Ajoutez la colonne pour afficher le nom de la catégorie parente */}
        <td className="p-2">
  {type.parent_id ? (
    (() => {
      const parentType = types.find((t) => t.idType === type.parent_id);

      return parentType ? `${parentType.Nom}` : 'Type introuvable';
    })()
  ) : (
    'Aucune catégorie parente'
  )}
</td>



        <td className="align-middle text-center p-2">
          <div className="flex items-center space-x-2">
            <TypeUpdateButton
              productId={type.idType}
              onTypeUpdated={handleTypeUpdated}
              refreshTypes={refreshTypes}
            />
            <TypeDeleteButton
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
    resetFilePreview();
    handleReloadTypes();
  }}
  contentLabel="Modal d'ajout d'un nouveau type"
  style={{
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      width: "100%",  // Ajustez la largeur à votre besoin
      height: "100%", // Ajustez la hauteur à votre besoin
      overflow: "auto",
      display: "flex",
      flexDirection: "column",  // Utilisez une disposition en colonne
      alignItems: "center",  // Alignez les éléments au centre
      justifyContent: "center",
      top: "0%",  // Ajustez la position en haut
      left: "0%",  // Ajustez la position à gauche
      right: "0%",  // Ajustez la position à droite
      bottom: "0%",  // Ajustez la position en bas
    },
  }}
>
  {/* Contenu de la modal */}
  <div style={{ flex: 1, marginRight: "20px", width: "33%", margin: "0 auto" }}>
          <div style={{ margin: "20px" }}>
    <a
      href="#"
      onClick={() => setIsAddModalOpen(false)}
      className="text-blue-500 underline mb-4"
    >
      Retour sur Administration - Liste des types
    </a>

    <p className="text-xl font-bold mb-4" style={{ marginTop: "100px"}}>
      Ajouter un nouveau type
    </p>

    <hr style={{ marginBottom: "100px", borderTop: "2px solid #ccc" }} />
    <div style={{ marginBottom: "7px" }}>
      <label>Nom du type</label>
    </div>
    <div style={{ marginBottom: "20px" }}>
    
    <input
      type="text"
      name="typeName"
      style={{ width: "100%" }}
      value={newTypeData.typeName || ""}
      onChange={(e) => {
        const inputValue = e.target.value;
        const sanitizedValue = inputValue.replace(/[^a-zA-ZÀ-ÿ&\s-]/g, ''); // Autorise les lettres, les accents, les espaces et le signe "-"
        setNewTypeData((prevData) => ({ ...prevData, typeName: sanitizedValue }));
      }}
    />






    </div>

    {/* Ajoutez le menu déroulant pour les types parent_id null */}
<div style={{ marginBottom: "7px" }}>
  <label>Nom de la catégorie</label>
</div>
<div>
  <select
    name="parent_id"
    style={{ width: "100%", marginBottom: "20px" }}
    onChange={(e) => setNewTypeData((prevData) => ({ ...prevData, parent_id: e.target.value }))}
  >
    <option value={null}>Choisissez une catégorie</option>
    {/* Triez les types parentTypes par ordre alphabétique avant de les mapper */}
    {parentTypes
      .sort((a, b) => a.Nom.localeCompare(b.Nom))
      .map((parentType) => (
        <option key={parentType.idType} value={parentType.idType}>
          {parentType.Nom}
        </option>
      ))}
  </select>
</div>

    </div>
  
    {/* Ajoutez d'autres champs au besoin */}
  </div>

  {/* Boutons Annuler et Créer ce type */}
  <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
    <button
  onClick={() => {
    handleNewProduct();
    setIsAddModalOpen(false);
    resetFilePreview();
  }}
  className="bg-gray-400 text-white p-2 rounded mr-2 hover:bg-gray-500"
>
  Annuler
</button>

    <button
      onClick={() => handleAddType()}
      className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
    >
      Créer ce type
    </button>
  </div>
</Modal>



    </div>
  );
};

export default ProductsType;
