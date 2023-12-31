import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useSelector } from "react-redux";

// Assurez-vous de remplacer '#root' par l'ID de l'élément racine de votre application
Modal.setAppElement("#root");

const TypeUpdateButton = ({ productId, onTypeUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedProductData, setUpdatedProductData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [types, setTypes] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [allTypes, setAllTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState('');
  const [newTypeData, setNewTypeData] = useState({
    parent_id: null, // Définissez la valeur par défaut selon vos besoins
  });
  const [parentTypes, setParentTypes] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const typesResponse = await axios.get(
          "https://localhost:8000/api/types",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
          }
        );
        setAllTypes(typesResponse.data);

        const productResponse = await axios.get(
          `https://localhost:8000/api/types/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
          }
        );
        setUpdatedProductData(productResponse.data);

        // Définir la valeur actuelle du type de type dans l'état
        setSelectedProductType(productResponse.data.Nom);
      } catch (error) {
        fetchTypes();
      }
    };

    fetchData();
    fetchTypes();
  }, [productId, token]);

  const openModal = async () => {
    try {
      // Effectuez une requête pour obtenir le type de type au moment de l'ouverture de la modal
      const productResponse = await axios.get(
        `https://localhost:8000/api/types/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      // Utilisez les données obtenues pour mettre à jour l'état de la modal
      setUpdatedProductData(productResponse.data);
      setIsModalOpen(true);
    } catch (error) {}
  };
  
  // ...

const fetchTypes = async () => {
  try {
    const typesResponse = await axios.get(
      "https://localhost:8000/api/types",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      }
    );
    setAllTypes(typesResponse.data);

    // Filtrer les types avec parent_id null pour le menu déroulant
    const filteredParentTypes = typesResponse.data.filter(
      (type) => type.parent_id === null
    );

    // Triez les types par ordre alphabétique
    const sortedParentTypes = filteredParentTypes.sort((a, b) => a.Nom.localeCompare(b.Nom));

    setParentTypes(sortedParentTypes);
  } catch (error) {
    console.error("Erreur lors de la récupération des types :", error);
  }
};

// ...


  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateType = async () => {
    try {
      // Construisez un objet avec les données mises à jour
      const updatedTypeData = {
        typeName: updatedProductData.Nom,
        parent_id: newTypeData.parent_id !== null ? newTypeData.parent_id : updatedProductData.parent_id,
      };
      
      // Effectuez la requête PUT pour mettre à jour le type
      const response = await axios.put(
        `https://localhost:8000/api/types/${productId}`,
        updatedTypeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );
  
      // Si une fonction de rappel a été fournie, appelez-la avec les données mises à jour
      if (onTypeUpdated) {
        onTypeUpdated({ productId, updatedData: response.data });
      }
  
      // Fermez la modal après la mise à jour
      closeModal();
  
      // Mettez à jour la liste des types
      fetchTypes();
    } catch (error) {
      fetchTypes(); 
    }
  };
  

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Mise à jour de l'état avec la nouvelle valeur
    setUpdatedProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div>
      <svg
        style={{ cursor: "pointer" }}
        onClick={openModal}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0)">
          <path
            d="M4 20H8L18.5 9.5C18.7626 9.23741 18.971 8.92561 19.1131 8.58245C19.2553 8.23929 19.3284 7.87149 19.3284 7.5C19.3284 7.12856 19.2553 6.76077 19.1131 6.41761C18.971 6.07445 18.7626 5.76264 18.5 5.5C18.2374 5.23736 17.9256 5.02902 17.5824 4.88687C17.2392 4.74473 16.8714 4.67158 16.5 4.67158C16.1286 4.67158 15.7608 4.74473 15.4176 4.88687C15.0744 5.02902 14.7626 5.23736 14.5 5.5L4 16V20Z"
            stroke="#00819E"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.5 6.5L17.5 10.5"
            stroke="#00819E"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  contentLabel="Modal de mise à jour du type"
  style={{
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      width: "100%",
      height: "100%",
      overflow: "auto",
      display: "flex",
      flexDirection: "column",  // Utilisez une disposition en colonne
      alignItems: "center",  // Alignez les éléments au centre
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
  }}
>
<div style={{ flex: 1, marginRight: "20px", width: "33%", margin: "0 auto" }}>
    <div style={{ margin: "20px" }}>
      <a
        href="#"
        onClick={() => setIsModalOpen(false)}
        className="text-blue-500 underline mb-4"
      >
        Retour sur Administration - Liste des types
      </a>

      <p className="text-xl font-bold mb-4" style={{ marginTop: "100px" }}>
        Mise à jour du type
      </p>

      <hr style={{ marginBottom: "100px", borderTop: "2px solid #ccc" }} />

      {/* Nom du type */}
      <div style={{ marginBottom: "7px" }}>
        <label>Nom du type</label>
      </div>
      <div style={{ marginBottom: "20px" }}>
        
        <input
          value={updatedProductData.Nom || ""}
          type="text"
          name="Nom"
          style={{ width: "100%" }}
          onChange={handleInputChange}
          onKeyPress={(e) => {
            const regex = /^[a-zA-ZÀ-ÿ&-]$/; // Autorise les lettres avec des accents et le signe -
            const key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
            if (!regex.test(key)) {
              e.preventDefault();
              return false;
            }
          }}
        />

      </div>
{/* ------------------------------------------------------------------------------------------------ */}
<div style={{ marginBottom: "7px" }}>
    <label>Nom de la catégorie</label>
</div>
<div>
    <select
      name="parent_id"
      style={{ width: "100%", marginBottom: "100px" }}
      value={newTypeData.parent_id || updatedProductData.parent_id}
      onChange={(e) => setNewTypeData({ ...newTypeData, parent_id: e.target.value })}
    >
      {parentTypes.map((parentType) => (
        <option key={parentType.idType} value={parentType.idType}>
          {parentType.Nom}
        </option>
      ))}
    </select>
  </div>
{/* ------------------------------------------------------------------------------------------------ */}
      {/* Ajoutez d'autres champs au besoin */}
    </div>

    {/* Boutons Annuler et Mettre à jour cet article */}
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
          setIsModalOpen(false);
          setSelectedFile(null);
        }}
        className="bg-gray-400 text-white p-2 rounded mr-2 hover:bg-gray-500"
      >
        Annuler
      </button>
      <button
        onClick={updateType}
        className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        Mettre à jour ce type
      </button>
    </div>
  </div>
</Modal>

    </div>
  );
};

export default TypeUpdateButton;
