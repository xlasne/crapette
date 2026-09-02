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
	// opened locally (file://) or from a preview server: extract the page's
	// filename (and /fr/ if present) from the current path and point it at
	// the live site, so Share/Copy Link never hands out a file:// or
	// localhost address.
	const PROD_BASE = 'https://xlasne.github.io/crapette';
	function getShareUrl() {
		const path = window.location.pathname;
		const segments = path.split('/').filter(Boolean);
		const filename = segments.length ? segments[segments.length - 1] : 'index.html';
		const isFr = /(^|\/)fr(\/|$)/.test(path);
		return PROD_BASE + (isFr ? '/fr/' : '/') + (filename || 'index.html');
	}
	const GAME_URL = getShareUrl();
	const APP_STORE_URL = 'https://apps.apple.com/app/6608980248';

	// Language detection (based on <html lang="..."> set on each page)
	const LANG = (document.documentElement.lang || 'en').toLowerCase().indexOf('fr') === 0 ? 'fr' : 'en';

	const STRINGS = {
		en: {
			shareMessage: `Check out ${GAME_NAME} - An iPhone Card Game designed to train your brain! Download now: ${APP_STORE_URL}`,
			shareDescription: `${GAME_NAME} is a classic card game to train your brain. Download it on the App Store!`,
			tweetText: `I just discovered ${GAME_NAME}! Check it out: ${APP_STORE_URL}`,
			emailSubject: `Check out ${GAME_NAME}!`,
			emailBody: (message) => `I think you'll love ${GAME_NAME}!\n\n${message}\n\nDownload it now!`,
			webShareUnsupported: 'Web Share API is not supported on this browser.',
			copyFailed: 'Failed to copy link. Please try again.',
			copied: 'Copied!'
		},
		fr: {
			shareMessage: `Découvrez ${GAME_NAME} - Un jeu de cartes sur iPhone conçu pour entraîner votre cerveau ! Téléchargez-le maintenant : ${APP_STORE_URL}`,
			shareDescription: `${GAME_NAME} est un jeu de cartes classique pour entraîner votre cerveau. Téléchargez-le sur l'App Store !`,
			tweetText: `Je viens de découvrir ${GAME_NAME} ! À voir : ${APP_STORE_URL}`,
			emailSubject: `Découvrez ${GAME_NAME} !`,
			emailBody: (message) => `Je pense que vous allez adorer ${GAME_NAME} !\n\n${message}\n\nTéléchargez-le maintenant !`,
			webShareUnsupported: "L'API de partage web n'est pas prise en charge par ce navigateur.",
			copyFailed: 'Échec de la copie du lien. Veuillez réessayer.',
			copied: 'Copié !'
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
