import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useSelector } from "react-redux";

// Assurez-vous de remplacer '#root' par l'ID de l'élément racine de votre application
Modal.setAppElement("#root");

const CategorieUpdateButton = ({ productId, onTypeUpdated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatedProductData, setUpdatedProductData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [types, setTypes] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const [allTypes, setAllTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState('');


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
        
        setSelectedProductType(currentProductType);
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
    } catch (error) {
    }
  };
  
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
    } catch (error) {
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateCategorie = async () => {
  try {
    // Construisez un objet avec les données mises à jour
    const updatedTypeData = {
      typeName: updatedProductData.Nom, // Assurez-vous que cela correspond au nom du champ dans le backend
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
    // Mettre à jour l'état seulement si l'entrée est valide
    setUpdatedProductData({
      ...updatedProductData,
      [e.target.name]: e.target.value
    });
  };

  const handleKeyPress = (e) => {
    // Récupérer le caractère entré
    const char = e.key;
  
    // Autoriser les lettres, les accents, le signe "-" et "&"
    const isValidChar = /^[a-zA-ZÀ-ÿ&-]$/.test(char);
  
    // Si le caractère n'est pas valide, annuler l'action par défaut
    if (!isValidChar) {
      e.preventDefault();
    }
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
      width: "100%",  // Ajustez la largeur à votre besoin
      height: "100%", // Ajustez la hauteur à votre besoin
      overflow: "auto",
      display: "flex",
      flexDirection: "column",  // Utilisez une disposition en colonne
      alignItems: "center",  // Alignez les éléments au centre
      
      top: "0%",  // Ajustez la position en haut
      left: "0%",  // Ajustez la position à gauche
      right: "0%",  // Ajustez la position à droite
      bottom: "0%",  // Ajustez la position en bas
    },
  }}
>
  <div>
    <div style={{margin:"20px" }}>
      <a
        href="#"
        onClick={() => setIsModalOpen(false)}
        className="text-blue-500 underline mb-4"
      >
        Retour sur Administration - Liste des types
      </a>

      <p className="text-xl font-bold mb-4" style={{ marginTop: "45px", marginBottom: "27px" }}>
        Mise à jour de la catégorie
      </p>

      <hr style={{ marginBottom: "20px", borderTop: "1px solid black" }} />

      {/* Nom de la catégorie */}
      <div style={{ marginBottom: "7px" }}>
        <label>Nom de la catégorie</label>
      </div>
      <div style={{ marginBottom: "20px" }}>
      <input
          value={updatedProductData.Nom || ""}
          type="text"
          name="Nom"
          style={{ width: "100%" }}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
      </div>

      {/* Ajoutez d'autres champs au besoin */}
    </div>

    {/* Boutons Annuler et Mettre à jour cet article */}
    <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop:"220px",
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
        onClick={updateCategorie}
        className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        Mettre à jour cette catégorie
      </button>
    </div>
  </div>
</Modal>

    </div>
  );
};

export default CategorieUpdateButton;


