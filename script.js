// ==========================================================================
// 1. CONTADOR DE VISITAS (COM CONTINGÊNCIA ATUALIZADA)
// ==========================================================================
function atualizarContador() {
    const visualizacoesBase = 1420;

    try {
        let locais = localStorage.getItem('visitas_locais') || 0;
        locais = parseInt(locais) + 1;
        localStorage.setItem('visitas_locais', locais);

        const totalVisitas = visualizacoesBase + locais;
        const elementoVisitas = document.getElementById('numVisitas');

        if (elementoVisitas) {
            elementoVisitas.innerText = totalVisitas.toLocaleString('pt-BR');
        }
    } catch (error) {
        console.log("Erro ao acessar o localStorage do navegador:", error);
        const elementoVisitas = document.getElementById('numVisitas');
        if (elementoVisitas) elementoVisitas.innerText = "1.425";
    }
}
window.addEventListener('DOMContentLoaded', atualizarContador);

// ==========================================================================
// 2. SISTEMA INTERATIVO MULTI-FAIXAS DO CD PLAYER
// ==========================================================================
const playlistCD = [
    
    { titulo: "Hello", arquivo: "musicas/Hello.mp3" },
     { titulo: "TO PAGANDO PRA VER", arquivo: "musicas/TO PAGANDO PRA VER.mp3" },
    
];

let indiceAtual = 0;
const audio = document.getElementById('playerAudio');
const btnPlayPause = document.getElementById('btnPlayPause');
const iconePlay = document.getElementById('iconePlay');
const btnAnterior = document.getElementById('btnAnterior');
const btnProxima = document.getElementById('btnProxima');
const tituloMusica = document.getElementById('tituloMusica');
const barraProgresso = document.getElementById('barraProgresso');
const progressoContainer = document.getElementById('progressoContainer');
const tempoAtualTxt = document.getElementById('tempoAtual');
const tempoTotalTxt = document.getElementById('tempoTotal');
const capaContainer = document.getElementById('capaContainer');

function carregarMusica(indice) {
    if (playlistCD.length === 0) return;
    indiceAtual = indice;
    audio.src = playlistCD[indiceAtual].arquivo;
    tituloMusica.innerText = playlistCD[indiceAtual].titulo;
    barraProgresso.style.width = '0%';
    tempoAtualTxt.innerText = "0:00";
    tempoTotalTxt.innerText = "0:00";
}

function alternarPlayPause() {
    if (audio.paused) {
        // Correção de áudio: Força a ativação do contexto de som após clique do usuário
        audio.play().then(() => {
            iconePlay.className = 'fa-solid fa-pause';
            if (capaContainer) capaContainer.classList.add('rodando');
        }).catch(err => {
            console.log("Navegador bloqueou reprodução automática. Clique na página antes de dar play:", err);
        });
    } else {
        audio.pause();
        iconePlay.className = 'fa-solid fa-play';
        if (capaContainer) capaContainer.classList.remove('rodando');
    }
}

function musicaAnterior() {
    indiceAtual--;
    if (indiceAtual < 0) {
        indiceAtual = playlistCD.length - 1;
    }
    carregarMusica(indiceAtual);
    audio.play().then(() => {
        iconePlay.className = 'fa-solid fa-pause';
        if (capaContainer) capaContainer.classList.add('rodando');
    }).catch(err => console.log(err));
}

function proximaMusica() {
    indiceAtual++;
    if (indiceAtual >= playlistCD.length) {
        indiceAtual = 0;
    }
    carregarMusica(indiceAtual);
    audio.play().then(() => {
        iconePlay.className = 'fa-solid fa-pause';
        if (capaContainer) capaContainer.classList.add('rodando');
    }).catch(err => console.log(err));
}

function formatarTempo(segundos) {
    if (isNaN(segundos)) return "0:00";
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    return `${min}:${seg < 10 ? '0' : ''}${seg}`;
}

// Event Listeners do Player de Áudio
if (btnPlayPause) btnPlayPause.addEventListener('click', alternarPlayPause);
if (btnAnterior) btnAnterior.addEventListener('click', musicaAnterior);
if (btnProxima) btnProxima.addEventListener('click', proximaMusica);

if (audio) {
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const percentual = (audio.currentTime / audio.duration) * 100;
            if (barraProgresso) barraProgresso.style.width = `${percentual}%`;
        }
        if (tempoAtualTxt) tempoAtualTxt.innerText = formatarTempo(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
        if (tempoTotalTxt) tempoTotalTxt.innerText = formatarTempo(audio.duration);
    });

    audio.addEventListener('ended', proximaMusica);
}

if (progressoContainer && audio) {
    progressoContainer.addEventListener('click', (e) => {
        const larguraTotal = progressoContainer.clientWidth;
        const cliqueX = e.offsetX;
        const duracaoTotal = audio.duration;
        if (duracaoTotal) {
            audio.currentTime = (cliqueX / larguraTotal) * duracaoTotal;
        }
    });
}

// Inicializa a primeira faixa do player assim que a página carregar
window.addEventListener('load', () => {
    carregarMusica(0);
});

// ==========================================================================
// 3. SELEÇÃO E LÓGICA DE DIÁLOGO DO VÍDEO (BOTÃO WHATSAPP)
// ==========================================================================
const botoesVideoZap = document.querySelectorAll('.btn-video-zap');

botoesVideoZap.forEach(botao => {
    botao.addEventListener('click', function () {
        const itemVideo = botao.closest('.video-item');
        const tagVideo = itemVideo ? itemVideo.querySelector('source') : null;
        let nomeVideo = "Apresentação";

        if (tagVideo) {
            const srcCompleto = tagVideo.getAttribute('src');
            // Remove a pasta e a extensão para pegar apenas o nome limpo da música
            nomeVideo = srcCompleto.replace('videos/', '').replace('.mp4', '');
        }

        const mensagem = `Olá Jescklay! Assisti ao seu vídeo "${nomeVideo}" no seu site e achei sensacional. Gostaria de entender mais sobre a disponibilidade da sua agenda e orçamentos!`;
        const numero = "5588994379562";
        const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

        window.open(url, '_blank');
    });
});

// ==========================================================================
// 4. FORMULÁRIO DE ORÇAMENTO DIRETO PARA O WHATSAPP
// ==========================================================================
/**
 * EFEITO TYPEWRITER NO PLACEHOLDER
 * Adicione este script ao final do seu arquivo .js principal
 */

const typewriterEffect = (element, phrases, delay = 100) => {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';

    function type() {
        const fullPhrase = phrases[phraseIndex];

        if (isDeleting) {
            currentText = fullPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentText = fullPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        element.setAttribute('placeholder', currentText);

        let typeSpeed = isDeleting ? delay / 2 : delay;

        if (!isDeleting && charIndex === fullPhrase.length) {
            typeSpeed = 2000; // Pausa no final da frase
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }

        setTimeout(type, typeSpeed);
    }

    type();
};

// Inicializando o efeito nos campos
const inputNome = document.getElementById('formNome');
const inputCidade = document.getElementById('formCidade');
const inputDetalhes = document.getElementById('formDetalhes');

if (inputNome) {
    typewriterEffect(inputNome, ["Digite seu nome...", "Como prefere ser chamado?", "Insira seu nome aqui..."]);
}

if (inputCidade) {
    typewriterEffect(inputCidade, ["Sua Cidade...", "Onde será o evento?", "Qual a localização?"]);
}

if (inputDetalhes) {
    typewriterEffect(inputDetalhes, ["Detalhes do evento...", "Data e tipo de público?", "Conte sobre a estrutura..."]);
}

// ==========================================================================
// 5. LÓGICA RESPONSIVA DO MENU MOBILE (HAMBÚRGUER)
// ==========================================================================
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');
const linksDoMenu = document.querySelectorAll('.nav-links a');

if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburgerBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Fecha o menu móvel ao clicar em qualquer link das seções
    linksDoMenu.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburgerBtn.classList.remove('active');
        });
    });

    // Fecha o menu se o usuário clicar em qualquer área vazia fora do menu aberto
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburgerBtn.classList.remove('active');


        }
    });


}

// ==========================================================================
// 6. FORÇAR ROLAGEM E ENTRADA PELA PÁGINA PRINCIPAL (TOPO / PERFIL)
// ==========================================================================
function forcarPaginaPrincipal() {
    // Remove identificadores (#id) da barra de endereços para anular o scroll nativo do navegador
    if (window.location.hash) {
        window.history.replaceState(null, null, window.location.pathname);
    }

    // Move o scroll para as coordenadas iniciais (0,0) de forma imediata
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
}

// Executa em múltiplos estágios do carregamento para evitar o cache de rolagem dos navegadores modernos
window.addEventListener('DOMContentLoaded', forcarPaginaPrincipal);
window.addEventListener('load', forcarPaginaPrincipal);

// Caso o usuário dê um reload rápido (F5), reseta a posição no descarregamento
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};