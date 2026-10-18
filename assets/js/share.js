/**
 * Social Sharing Module
 * Allows users to share Crapette Pro on social networks
 * without requiring accounts on those platforms
 */

(function() {
	'use strict';

	// Configuration
	const GAME_NAME = 'Crapette Pro';
	// Always build a real, shareable production URL, even when this page is
	// opened locally (file://) or from a preview server: point at the live
	// site, so Share/Copy Link never hands out a file:// or localhost
	// address. The link shared is the home page of the current language
	// (/fr/, /de/… if present in the path) — the share page itself is not the
	// page a friend should land on.
	const PROD_BASE = 'https://xlasne.github.io/crapette';
	function getShareUrl() {
		const dir = window.location.pathname.match(/(?:^|\/)(fr|de|es|it|nl)\//);
		return PROD_BASE + (dir ? '/' + dir[1] + '/' : '/') + 'index.html';
	}
	const GAME_URL = getShareUrl();
	const APP_STORE_URL = 'https://apps.apple.com/app/id6608980248';

	// Language detection (based on <html lang="..."> set on each page)
	const PAGE_LANG = (document.documentElement.lang || 'en').toLowerCase().slice(0, 2);
	const LANG = ['fr', 'de', 'es', 'it', 'nl'].indexOf(PAGE_LANG) >= 0 ? PAGE_LANG : 'en';

	const STRINGS = {
		en: {
			shareMessage: `Check out ${GAME_NAME} - a card game for iPhone and iPad, designed to train your brain! Download now: ${APP_STORE_URL}`,
			shareDescription: `${GAME_NAME} is a classic card game to train your brain. Download it on the App Store!`,
			tweetText: `I just discovered ${GAME_NAME}! Check it out: ${APP_STORE_URL}`,
			emailSubject: `Check out ${GAME_NAME}!`,
			emailBody: (message) => `I think you'll love ${GAME_NAME}!\n\n${message}\n\nDownload it now!`,
			webShareUnsupported: 'Web Share API is not supported on this browser.',
			copyFailed: 'Failed to copy link. Please try again.',
			copied: 'Copied!'
		},
		fr: {
			shareMessage: `Découvrez ${GAME_NAME} - un jeu de cartes pour iPhone et iPad, conçu pour entraîner votre cerveau ! Téléchargez-le maintenant : ${APP_STORE_URL}`,
			shareDescription: `${GAME_NAME} est un jeu de cartes classique pour entraîner votre cerveau. Téléchargez-le sur l'App Store !`,
			tweetText: `Je viens de découvrir ${GAME_NAME} ! À voir : ${APP_STORE_URL}`,
			emailSubject: `Découvrez ${GAME_NAME} !`,
			emailBody: (message) => `Je pense que vous allez adorer ${GAME_NAME} !\n\n${message}\n\nTéléchargez-le maintenant !`,
			webShareUnsupported: "L'API de partage web n'est pas prise en charge par ce navigateur.",
			copyFailed: 'Échec de la copie du lien. Veuillez réessayer.',
			copied: 'Copié !'
		},
		de: {
			shareMessage: `Entdecke ${GAME_NAME} – ein Kartenspiel für iPhone und iPad, das dein Gehirn trainiert! Jetzt laden: ${APP_STORE_URL}`,
			shareDescription: `${GAME_NAME} ist ein klassisches Kartenspiel, das dein Gehirn trainiert. Jetzt im App Store!`,
			tweetText: `Ich habe gerade ${GAME_NAME} entdeckt! Schau mal: ${APP_STORE_URL}`,
			emailSubject: `Entdecke ${GAME_NAME}!`,
			emailBody: (message) => `Ich glaube, ${GAME_NAME} wird dir gefallen!\n\n${message}\n\nJetzt laden!`,
			webShareUnsupported: 'Teilen wird von diesem Browser nicht unterstützt.',
			copyFailed: 'Der Link konnte nicht kopiert werden. Bitte versuche es erneut.',
			copied: 'Kopiert!'
		},
		es: {
			shareMessage: `Descubre ${GAME_NAME}, un juego de cartas para iPhone y iPad pensado para entrenar tu mente. Descárgalo ya: ${APP_STORE_URL}`,
			shareDescription: `${GAME_NAME} es un juego de cartas clásico para entrenar tu mente. ¡Descárgalo en el App Store!`,
			tweetText: `¡Acabo de descubrir ${GAME_NAME}! Échale un vistazo: ${APP_STORE_URL}`,
			emailSubject: `¡Descubre ${GAME_NAME}!`,
			emailBody: (message) => `¡Creo que te va a encantar ${GAME_NAME}!\n\n${message}\n\n¡Descárgalo ya!`,
			webShareUnsupported: 'Este navegador no permite compartir.',
			copyFailed: 'No se ha podido copiar el enlace. Inténtalo de nuevo.',
			copied: '¡Copiado!'
		},
		it: {
			shareMessage: `Scopri ${GAME_NAME}, un gioco di carte per iPhone e iPad pensato per allenare la mente! Scaricalo ora: ${APP_STORE_URL}`,
			shareDescription: `${GAME_NAME} è un classico gioco di carte per allenare la mente. Scaricalo dall'App Store!`,
			tweetText: `Ho appena scoperto ${GAME_NAME}! Dai un'occhiata: ${APP_STORE_URL}`,
			emailSubject: `Scopri ${GAME_NAME}!`,
			emailBody: (message) => `Credo che ${GAME_NAME} ti piacerà!\n\n${message}\n\nScaricalo ora!`,
			webShareUnsupported: 'Questo browser non supporta la condivisione.',
			copyFailed: 'Impossibile copiare il link. Riprova.',
			copied: 'Copiato!'
		},
		nl: {
			shareMessage: `Ontdek ${GAME_NAME}, een kaartspel voor iPhone en iPad dat je brein traint! Download het nu: ${APP_STORE_URL}`,
			shareDescription: `${GAME_NAME} is een klassiek kaartspel dat je brein traint. Download het in de App Store!`,
			tweetText: `Ik heb net ${GAME_NAME} ontdekt! Kijk maar: ${APP_STORE_URL}`,
			emailSubject: `Ontdek ${GAME_NAME}!`,
			emailBody: (message) => `Ik denk dat je ${GAME_NAME} geweldig gaat vinden!\n\n${message}\n\nDownload het nu!`,
			webShareUnsupported: 'Delen wordt niet ondersteund in deze browser.',
			copyFailed: 'Kopiëren van de link is mislukt. Probeer het opnieuw.',
			copied: 'Gekopieerd!'
		}
	};

	const T = STRINGS[LANG];
	const SHARE_MESSAGE = T.shareMessage;

	// Initialize share functionality when DOM is ready
	document.addEventListener('DOMContentLoaded', function() {
		initializeShareButtons();
	});

	/**
	 * Initialize all share buttons
	 */
	function initializeShareButtons() {
		// Native Web Share API button
		const shareBtn = document.getElementById('shareBtn');
		if (shareBtn) {
			shareBtn.addEventListener('click', handleNativeShare);
			// Hide if Web Share API is not supported
			if (!navigator.share) {
				shareBtn.style.display = 'none';
			}
		}

		// Twitter share
		const twitterShare = document.getElementById('twitterShare');
		if (twitterShare) {
			twitterShare.href = getTwitterShareUrl();
			twitterShare.addEventListener('click', function(e) {
				e.preventDefault();
				openShareWindow(this.href, 'Twitter');
			});
		}

		// Facebook share
		const facebookShare = document.getElementById('facebookShare');
		if (facebookShare) {
			facebookShare.href = getFacebookShareUrl();
			facebookShare.addEventListener('click', function(e) {
				e.preventDefault();
				openShareWindow(this.href, 'Facebook');
			});
		}

		// WhatsApp share
		const whatsappShare = document.getElementById('whatsappShare');
		if (whatsappShare) {
			whatsappShare.href = getWhatsAppShareUrl();
			whatsappShare.addEventListener('click', function(e) {
				e.preventDefault();
				window.location.href = this.href;
			});
		}

		// Email share
		const emailShare = document.getElementById('emailShare');
		if (emailShare) {
			emailShare.href = getEmailShareUrl();
		}

		// Copy link to clipboard
		const copyLinkBtn = document.getElementById('copyLinkBtn');
		if (copyLinkBtn) {
			copyLinkBtn.addEventListener('click', handleCopyLink);
		}
	}

	/**
	 * Handle native Web Share API
	 */
	async function handleNativeShare(e) {
		e.preventDefault();

		if (!navigator.share) {
			alert(T.webShareUnsupported);
			return;
		}

		try {
			await navigator.share({
				title: GAME_NAME,
				text: SHARE_MESSAGE,
				url: GAME_URL
			});
		} catch (err) {
			if (err.name !== 'AbortError') {
				console.log('Share failed:', err);
			}
		}
	}

	/**
	 * Get Twitter share URL
	 */
	function getTwitterShareUrl() {
		const text = encodeURIComponent(T.tweetText);
		return `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(GAME_URL)}`;
	}

	/**
	 * Get Facebook share URL
	 */
	function getFacebookShareUrl() {
		return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(GAME_URL)}&quote=${encodeURIComponent(SHARE_MESSAGE)}`;
	}

	/**
	 * Get WhatsApp share URL
	 */
	function getWhatsAppShareUrl() {
		const text = encodeURIComponent(SHARE_MESSAGE);
		return `https://wa.me/?text=${text}`;
	}

	/**
	 * Get Email share URL
	 */
	function getEmailShareUrl() {
		const subject = encodeURIComponent(T.emailSubject);
		const body = encodeURIComponent(T.emailBody(SHARE_MESSAGE));
		return `mailto:?subject=${subject}&body=${body}`;
	}

	/**
	 * Open a share window (for Twitter/Facebook)
	 */
	function openShareWindow(url, platform) {
		const width = 600;
		const height = 400;
		const left = (screen.width - width) / 2;
		const top = (screen.height - height) / 2;
		window.open(url, platform, `width=${width},height=${height},left=${left},top=${top}`);
	}

	/**
	 * Copy game URL to clipboard
	 */
	function handleCopyLink(e) {
		e.preventDefault();

		// Use modern Clipboard API if available
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(GAME_URL).then(function() {
				showCopyFeedback(e.target);
			}).catch(function(err) {
				console.log('Failed to copy:', err);
				fallbackCopyToClipboard(GAME_URL, e.target);
			});
		} else {
			// Fallback for older browsers
			fallbackCopyToClipboard(GAME_URL, e.target);
		}
	}

	/**
	 * Fallback method to copy to clipboard
	 */
	function fallbackCopyToClipboard(text, button) {
		const textArea = document.createElement('textarea');
		textArea.value = text;
		textArea.style.position = 'fixed';
		textArea.style.left = '-999999px';
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			document.execCommand('copy');
			showCopyFeedback(button);
		} catch (err) {
			console.log('Failed to copy:', err);
			alert(T.copyFailed);
		}

		document.body.removeChild(textArea);
	}

	/**
	 * Show feedback when link is copied
	 */
	function showCopyFeedback(button) {
		const originalText = button.innerHTML;
		button.innerHTML = '<span class="icon solid fa-check"></span> ' + T.copied;
		button.style.backgroundColor = '#28a745';

		setTimeout(function() {
			button.innerHTML = originalText;
			button.style.backgroundColor = '';
		}, 2000);
	}

})();
