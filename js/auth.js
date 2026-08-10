// Importar módulos do Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// A tua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDsmSZY1Vn-GI9Ryf8WEYRqhPCo98VlyiY",
  authDomain: "hop-8f1be.firebaseapp.com",
  projectId: "hop-8f1be",
  storageBucket: "hop-8f1be.firebasestorage.app",
  messagingSenderId: "229722213570",
  appId: "1:229722213570:web:8481ee8c74588aa7397f5b",
  measurementId: "G-3272YB7P7X"
};

// Inicializar serviços
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// -------------------------------------------------------------
// 1. REGISTO DE UTILIZADOR
// -------------------------------------------------------------
const registerForm = document.getElementById("register-form");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value.trim();
    const dob = document.getElementById("dob").value;

    // Validação da Palavra-passe (6-18 caracteres, 1 minúscula, 1 número)
    const passwordRegex = /^(?=.*[a-z])(?=.*\d).{6,18}$/;
    if (!passwordRegex.test(password)) {
      alert("A palavra-passe deve ter entre 6 e 18 caracteres e conter pelo menos uma letra minúscula e um número.");
      return;
    }

    // Validação do Telemóvel Português (+351)
    const phoneRegex = /^(\+351)[9][1236]\d{7}$/;
    if (!phoneRegex.test(phone)) {
      alert("Por favor, insere um número de telemóvel português válido a começar por +351 (ex: +351912345678).");
      return;
    }

    try {
      // Criar conta no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar dados adicionais na coleção 'users' do Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        phone: phone,
        dob: dob,
        createdAt: new Date().toISOString()
      });

      alert("Conta criada com sucesso! A redirecionar para a tua conta...");
      window.location.href = "/conta";

    } catch (error) {
      console.error("Erro ao criar conta:", error);
      if (error.code === 'auth/email-already-in-use') {
        alert("Este endereço de email já está em uso.");
      } else {
        alert("Erro ao registar: " + error.message);
      }
    }
  });
}

// -------------------------------------------------------------
// 2. GESTÃO DE CONTA E SESSÃO
// -------------------------------------------------------------
onAuthStateChanged(auth, async (user) => {
  const emailSpan = document.getElementById("user-email");
  const phoneSpan = document.getElementById("user-phone");
  const dobSpan = document.getElementById("user-dob");

  // Se o utilizador estiver na página de conta
  if (window.location.pathname.includes("/conta")) {
    if (user) {
      // Procurar dados extra no Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (emailSpan) emailSpan.textContent = userData.email;
        if (phoneSpan) phoneSpan.textContent = userData.phone;
        if (dobSpan) dobSpan.textContent = userData.dob;
      } else {
        if (emailSpan) emailSpan.textContent = user.email;
      }
    } else {
      // Se não estiver autenticado, redireciona para a página de registo
      window.location.href = "/registo";
    }
  }
});

// -------------------------------------------------------------
// 3. TERMINAR SESSÃO (LOGOUT)
// -------------------------------------------------------------
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      alert("Sessão terminada.");
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao terminar sessão:", error);
    }
  });
}
