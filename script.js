// Elementos de entrada (inputs)
const passwordDisplay = document.getElementById('passwordDisplay');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');

// Elementos de checkboxes
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const excludeAmbiguousCheckbox = document.getElementById('excludeAmbiguous');

// Elementos de força
const strengthText = document.getElementById('strengthText');
const strengthBars = document.querySelectorAll('.bar');

// Conjuntos de caracteres
const charsets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Caracteres considerados ambíguos (fáceis de confundir visualmente)
const ambiguousChars = 'il1LoO0';

// Variável que guarda a senha atual
let currentPassword = '';

// Função 1: Gerar Senha
function generatePassword() {
    // Pega o tamanho do slider
    const length = parseInt(lengthSlider.value);
    
    // Cria um "pool" vazio de caracteres disponíveis
    let availableCharacters = '';
    
    // Adiciona cada tipo de caractere se o checkbox estiver marcado
    if (uppercaseCheckbox.checked) availableCharacters += charsets.uppercase;
    if (lowercaseCheckbox.checked) availableCharacters += charsets.lowercase;
    if (numbersCheckbox.checked) availableCharacters += charsets.numbers;
    if (symbolsCheckbox.checked) availableCharacters += charsets.symbols;
    
    // Remove caracteres ambíguos, se a opção estiver marcada
    if (excludeAmbiguousCheckbox.checked) {
        availableCharacters = availableCharacters
            .split('')
            .filter(char => !ambiguousChars.includes(char))
            .join('');
    }
    
    // Validação: pelo menos um tipo precisa estar selecionado
    if (availableCharacters.length === 0) {
        alert('Selecione pelo menos uma opção de caracteres!');
        return;
    }
    
    // Gera a senha
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * availableCharacters.length);
        password += availableCharacters[randomIndex];
    }
    
    // Guarda a senha na variável global
    currentPassword = password;
    updateDisplay();
}

// Função 2: Atualizar Exibição
function updateDisplay() {
    // Coloca a senha no campo de texto
    passwordDisplay.value = currentPassword;
    
    // Atualiza o tamanho exibido
    lengthValue.textContent = lengthSlider.value;
    
    // Calcula e mostra a força
    calculateStrength();
}

// Função 3: Calcular Força da Senha
function calculateStrength() {
    const length = currentPassword.length;
    
    // Verifica se tem cada tipo de caractere
    const hasUppercase = /[A-Z]/.test(currentPassword);
    const hasLowercase = /[a-z]/.test(currentPassword);
    const hasNumbers = /[0-9]/.test(currentPassword);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(currentPassword);
    
    // Conta quantos tipos diferentes tem
    let typeCount = 0;
    if (hasUppercase) typeCount++;
    if (hasLowercase) typeCount++;
    if (hasNumbers) typeCount++;
    if (hasSymbols) typeCount++;
    
    // Define o nível de força
    let strength = '';
    let barCount = 0;
    
    if (length < 8) {
        strength = 'Weak';
        barCount = 1;
    } else if (length < 12) {
        strength = typeCount >= 3 ? 'Medium' : 'Weak';
        barCount = typeCount >= 3 ? 2 : 1;
    } else if (length < 16) {
        strength = typeCount >= 3 ? 'Strong' : 'Medium';
        barCount = typeCount >= 3 ? 3 : 2;
    } else {
        strength = typeCount >= 4 ? 'Very Strong' : 'Strong';
        barCount = typeCount >= 4 ? 4 : 3;
    }
    
    // Atualiza o texto de força
    strengthText.textContent = strength;
    
    // Atualiza as barras de cor
    updateStrengthBars(strength, barCount);
}

// Função 4: Atualizar Barras de Força (Colorir)
function updateStrengthBars(strength, barCount) {
    // Define qual classe de cor usar baseado na força
    const strengthClass = strength === 'Weak' ? 'weak' : 
                         strength === 'Medium' ? 'medium' : 'strong';
    
    // Remove todas as classes de cor das barras
    strengthBars.forEach(bar => {
        bar.classList.remove('weak', 'medium', 'strong');
    });
    
    // Adiciona a classe apropriada nas barras ativas
    for (let i = 0; i < barCount; i++) {
        strengthBars[i].classList.add(strengthClass);
    }
}

// Quando clica no botão "Generate"
generateBtn.addEventListener('click', generatePassword);

// Quando o slider de tamanho muda
lengthSlider.addEventListener('input', () => {
    generatePassword();
});

// Quando marca/desmarca qualquer checkbox
uppercaseCheckbox.addEventListener('change', generatePassword);
lowercaseCheckbox.addEventListener('change', generatePassword);
numbersCheckbox.addEventListener('change', generatePassword);
symbolsCheckbox.addEventListener('change', generatePassword);
excludeAmbiguousCheckbox.addEventListener('change', generatePassword);

// Quando clica no botão "Copy"
copyBtn.addEventListener('click', copyPassword);

// Gera a primeira senha quando a página carrega
generatePassword();

// Função 5: Copiar Senha pro Clipboard
function copyPassword() {
    // Valida se tem senha
    if (!currentPassword) {
        alert('Gere uma senha primeiro!');
        return;
    }
    
    // Copia a senha pro clipboard (área de transferência)
    navigator.clipboard.writeText(currentPassword).then(() => {
        // Feedback visual: muda o texto do botão
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        
        // Volta ao normal depois de 2 segundos
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });
}