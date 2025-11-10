/**
 * ========================================
 * CORRECTIONS JAVASCRIPT PRIORITAIRES
 * Calculateur PEB Premium
 * ========================================
 */

(function() {
    'use strict';

    // ====================================
    // CORRECTION #1 : Validation robuste de l'input
    // ====================================

    /**
     * AVANT : type="number" avec validation minimale
     * APRÈS : type="text" avec validation complète et feedback
     */

    function setupInputValidation(elements, getConfig) {
        const surfaceInput = elements.surfaceInput;

        // Remplacer l'input number par text (dans le HTML)
        // <input type="text" inputmode="numeric" pattern="[0-9]*" ...>

        // Validation en temps réel : n'autoriser que les chiffres
        surfaceInput.addEventListener('input', (e) => {
            const cursorPosition = e.target.selectionStart;
            const oldValue = e.target.value;
            const newValue = oldValue.replace(/[^0-9]/g, '');

            if (oldValue !== newValue) {
                e.target.value = newValue;
                // Restaurer la position du curseur
                e.target.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
            }
        });

        // Validation finale avec feedback visuel
        function validateAndUpdate() {
            const config = getConfig();
            let value = parseInt(surfaceInput.value);

            // Supprimer l'état d'erreur précédent
            surfaceInput.classList.remove('error');

            if (isNaN(value) || surfaceInput.value === '') {
                showError(`Veuillez entrer une superficie entre ${config.min} et ${config.max} m²`);
                surfaceInput.classList.add('error');
                value = config.default;
            } else if (value < config.min) {
                showError(`La superficie minimum est ${config.min} m²`);
                surfaceInput.classList.add('error');
                value = config.min;
            } else if (value > config.max) {
                showError(`La superficie maximum est ${config.max} m²`);
                surfaceInput.classList.add('error');
                value = config.max;
            }

            surfaceInput.value = value;
            elements.slider.value = value;

            return value;
        }

        surfaceInput.addEventListener('blur', validateAndUpdate);
        surfaceInput.addEventListener('change', validateAndUpdate);
    }

    /**
     * Affiche un message d'erreur élégant (toast)
     */
    function showError(message) {
        // Supprimer les toasts existants
        const existingToasts = document.querySelectorAll('.peb-error-toast');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = 'peb-error-toast';
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');

        document.body.appendChild(toast);

        // Animation de sortie
        setTimeout(() => {
            toast.style.animation = 'toastSlide 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ====================================
    // CORRECTION #2 : Tooltip du slider
    // ====================================

    /**
     * NOUVEAU : Affiche un tooltip qui suit le curseur du slider
     */
    function setupSliderTooltip(elements) {
        const slider = elements.slider;
        const container = document.querySelector('.peb-slider-container');

        // Créer le tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'peb-slider-tooltip';
        tooltip.innerHTML = '<span id="tooltip-value">30</span> m²';
        tooltip.setAttribute('role', 'status');
        tooltip.setAttribute('aria-live', 'polite');
        container.appendChild(tooltip);

        const tooltipValue = tooltip.querySelector('#tooltip-value');

        // Calculer la position du tooltip
        function updateTooltipPosition() {
            const config = calculatorsConfig[currentType];
            const value = parseInt(slider.value);
            const percentage = ((value - config.min) / (config.max - config.min)) * 100;

            // Positionner le tooltip selon le pourcentage
            tooltip.style.setProperty('--slider-tooltip-position', `${percentage}%`);
            tooltipValue.textContent = value;
        }

        // Afficher le tooltip pendant le drag
        ['mousedown', 'touchstart'].forEach(evt => {
            slider.addEventListener(evt, () => {
                tooltip.classList.add('show');
                updateTooltipPosition();
            }, { passive: true });
        });

        // Mettre à jour pendant le mouvement
        slider.addEventListener('input', updateTooltipPosition);

        // Masquer après le release
        ['mouseup', 'touchend'].forEach(evt => {
            slider.addEventListener(evt, () => {
                setTimeout(() => {
                    tooltip.classList.remove('show');
                }, 500);
            }, { passive: true });
        });

        // Mettre à jour aussi lors du focus clavier
        slider.addEventListener('focus', () => {
            tooltip.classList.add('show');
            updateTooltipPosition();
        });

        slider.addEventListener('blur', () => {
            setTimeout(() => {
                tooltip.classList.remove('show');
            }, 500);
        });
    }

    // ====================================
    // CORRECTION #3 : Popup d'économies au chargement
    // ====================================

    /**
     * AVANT : Popup invisible jusqu'à interaction
     * APRÈS : Affichage automatique après 2s, puis replay à chaque changement significatif
     */
    function setupSavingsPopupAutoShow(elements, calculatePrice, getConfig) {
        let popupTimer = null;
        let lastShownSavings = 0;

        function showPopupWithDelay(savingsAmount, delay = 0) {
            clearTimeout(popupTimer);

            // Ne pas afficher si les économies n'ont pas changé significativement
            if (Math.abs(savingsAmount - lastShownSavings) < 5) {
                return;
            }

            popupTimer = setTimeout(() => {
                elements.popupSavings.textContent = savingsAmount + ' €';
                elements.savingsPopup.classList.add('show');
                lastShownSavings = savingsAmount;

                // Masquer après 2.5s
                setTimeout(() => {
                    elements.savingsPopup.classList.remove('show');
                }, 2500);
            }, delay);
        }

        // Afficher au chargement initial
        setTimeout(() => {
            const config = getConfig();
            const surface = parseInt(elements.slider.value);
            const normalPrice = calculatePrice(surface, config.tarifNormal, config.basePriceNormal, config.pivot);
            const promoPrice = calculatePrice(surface, config.tarifPromo, config.basePricePromo, config.pivot);
            const savings = normalPrice - promoPrice;

            showPopupWithDelay(savings, 2000); // 2s après le chargement
        }, 100);

        // Retourner la fonction pour l'utiliser ailleurs
        return showPopupWithDelay;
    }

    // ====================================
    // CORRECTION #4 : Animation du slider au chargement
    // ====================================

    /**
     * NOUVEAU : Animation "pulse" du thumb pour inviter à l'interaction
     */
    function setupSliderInvitation(elements) {
        const slider = elements.slider;

        // Marquer comme "interacté" après la première interaction
        ['mousedown', 'touchstart', 'input'].forEach(evt => {
            slider.addEventListener(evt, function markInteracted() {
                slider.classList.add('interacted');
                // Retirer les listeners pour éviter de les appeler plusieurs fois
                ['mousedown', 'touchstart', 'input'].forEach(e => {
                    slider.removeEventListener(e, markInteracted);
                });
            }, { once: true, passive: true });
        });

        // Ajouter une instruction textuelle qui disparaît
        const instruction = document.createElement('p');
        instruction.className = 'peb-slider-instruction';
        instruction.textContent = '👆 Déplacez le curseur pour ajuster';
        instruction.setAttribute('aria-hidden', 'true'); // Purement décoratif

        const sliderContainer = document.querySelector('.peb-slider-container');
        sliderContainer.appendChild(instruction);

        // Supprimer après l'animation
        setTimeout(() => {
            instruction.remove();
        }, 3000);
    }

    // ====================================
    // CORRECTION #5 : Badge premium sans JavaScript
    // ====================================

    /**
     * AVANT : Positionnement complexe via JavaScript
     * APRÈS : Aucun JavaScript nécessaire (pure CSS)
     *
     * SUPPRESSION de updatePremiumBadgePosition()
     * SUPPRESSION de window.addEventListener('resize', updatePremiumBadgePosition)
     */

    // Cette fonction n'est plus nécessaire !
    // Le badge est maintenant dans le flux normal (Flexbox)

    // ====================================
    // CORRECTION #6 : Debouncing pour performance
    // ====================================

    /**
     * NOUVEAU : Debounce pour les événements fréquents
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Utilisation pour l'input manuel
    // const debouncedInputHandler = debounce(handleSurfaceInput, 300);
    // elements.surfaceInput.addEventListener('input', debouncedInputHandler);

    // ====================================
    // CORRECTION #7 : Amélioration du CTA
    // ====================================

    /**
     * AVANT : Redirection simple avec sessionStorage
     * APRÈS : Feedback visuel + confirmation
     */
    function setupImprovedCTA(elements, getConfig, calculatePrice) {
        const ctaButton = elements.ctaButton;

        ctaButton.addEventListener('click', function handleCtaClick(e) {
            // Ajouter une animation de succès
            ctaButton.classList.add('success');

            // Créer un checkmark de confirmation
            const checkmark = document.createElement('span');
            checkmark.className = 'peb-cta-checkmark';
            checkmark.innerHTML = '<i class="fas fa-check"></i>';
            ctaButton.appendChild(checkmark);

            // Préparer les données
            const config = getConfig();
            const surface = parseInt(elements.slider.value);
            const promoPrice = calculatePrice(surface, config.tarifPromo, config.basePricePromo, config.pivot);
            const normalPrice = calculatePrice(surface, config.tarifNormal, config.basePriceNormal, config.pivot);

            const dataToStore = {
                type: config.label,
                surface: surface,
                price: promoPrice,
                price_off: normalPrice,
                code: 'peb_calc_cta',
                timestamp: new Date().toISOString()
            };

            // Stocker dans sessionStorage
            try {
                sessionStorage.setItem('peb_calc', JSON.stringify(dataToStore));
            } catch (error) {
                console.error('Erreur sessionStorage:', error);
            }

            // Option A : Paramètres URL (plus fiable)
            const url = new URL('https://pebify.be/contact/');
            url.searchParams.set('type', config.label);
            url.searchParams.set('surface', surface);
            url.searchParams.set('price', promoPrice);
            url.hash = 'form';

            // Retarder la redirection pour montrer l'animation
            setTimeout(() => {
                window.location.href = url.toString();
            }, 800);
        });
    }

    // ====================================
    // CORRECTION #8 : Gestion du focus dans la modal
    // ====================================

    /**
     * AMÉLIORATION : Piège de focus plus robuste
     */
    function setupModalFocusTrap(modal) {
        modal.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('show')) return;

            if (e.key === 'Escape') {
                closeModal();
                return;
            }

            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll(
                    'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
                );

                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // ====================================
    // CORRECTION #9 : Annonce ARIA des changements
    // ====================================

    /**
     * NOUVEAU : Annonces pour les lecteurs d'écran
     */
    function setupARIAAnnouncements(elements) {
        // Créer une région live pour les annonces
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only'; // Visible uniquement pour les lecteurs d'écran
        liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        document.body.appendChild(liveRegion);

        // Fonction pour annoncer les changements
        function announce(message) {
            liveRegion.textContent = message;
        }

        // Utilisation : annoncer quand le prix change significativement
        let lastAnnouncedPrice = null;

        return {
            announcePrice: (price, surface) => {
                if (price !== lastAnnouncedPrice) {
                    announce(`Nouveau prix : ${price} euros pour ${surface} mètres carrés`);
                    lastAnnouncedPrice = price;
                }
            },
            announceTabChange: (tabName) => {
                announce(`Calculateur pour ${tabName} sélectionné`);
            }
        };
    }

    // ====================================
    // CORRECTION #10 : Lazy loading des animations
    // ====================================

    /**
     * OPTIMISATION : Ne charger les animations que si nécessaire
     */
    function setupConditionalAnimations() {
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (isReducedMotion) {
            // Désactiver toutes les animations non essentielles
            document.documentElement.style.setProperty('--transition-fast', '0.01s');
            document.documentElement.style.setProperty('--transition-smooth', '0.01s');
            document.documentElement.style.setProperty('--transition-modal', '0.01s');

            // Supprimer les animations CSS
            const style = document.createElement('style');
            style.textContent = `
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }

        // Écouter les changements de préférence
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            if (e.matches) {
                // L'utilisateur a activé "réduire les mouvements"
                location.reload(); // Recharger pour appliquer les changements
            }
        });
    }

    // ====================================
    // BONUS : Analytics et suivi UX
    // ====================================

    /**
     * NOUVEAU : Suivi des interactions pour optimisation
     */
    function setupAnalytics(elements) {
        const analytics = {
            sliderInteractions: 0,
            tabChanges: 0,
            modalOpens: 0,
            ctaClicks: 0,
            startTime: Date.now(),

            track: function(event, data = {}) {
                console.log('[Analytics]', event, data);

                // Envoyer à votre service d'analytics (GA, Mixpanel, etc.)
                // if (window.gtag) {
                //     gtag('event', event, data);
                // }
            }
        };

        // Suivre les interactions avec le slider
        elements.slider.addEventListener('change', () => {
            analytics.sliderInteractions++;
            analytics.track('slider_interaction', {
                value: elements.slider.value,
                interaction_number: analytics.sliderInteractions
            });
        });

        // Suivre les changements d'onglets
        document.querySelector('.peb-tabs').addEventListener('click', (e) => {
            const tab = e.target.closest('.peb-tab');
            if (tab) {
                analytics.tabChanges++;
                analytics.track('tab_change', {
                    tab: tab.dataset.type,
                    change_number: analytics.tabChanges
                });
            }
        });

        // Suivre les ouvertures de modal
        elements.premiumBadge.addEventListener('click', () => {
            analytics.modalOpens++;
            analytics.track('modal_open', {
                open_number: analytics.modalOpens
            });
        });

        // Suivre les clics CTA
        elements.ctaButton.addEventListener('click', () => {
            analytics.ctaClicks++;
            const timeOnPage = (Date.now() - analytics.startTime) / 1000;
            analytics.track('cta_click', {
                time_on_page: timeOnPage,
                slider_interactions: analytics.sliderInteractions,
                tab_changes: analytics.tabChanges,
                modal_opens: analytics.modalOpens
            });
        });

        return analytics;
    }

    // ====================================
    // BONUS : Performance monitoring
    // ====================================

    /**
     * NOUVEAU : Surveiller la performance
     */
    function setupPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            // Observer les Long Tasks (tâches > 50ms)
            const longTaskObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.warn('[Performance] Long task detected:', entry.duration, 'ms');
                }
            });

            try {
                longTaskObserver.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // longtask pas supporté dans tous les navigateurs
            }

            // Mesurer le temps de chargement
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('[Performance] Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            });
        }
    }

    // ====================================
    // EXPORT DES FONCTIONS
    // ====================================

    // Si vous voulez utiliser ces fonctions, les exporter comme ceci :
    window.PEBCalculatorEnhancements = {
        setupInputValidation,
        setupSliderTooltip,
        setupSavingsPopupAutoShow,
        setupSliderInvitation,
        setupImprovedCTA,
        setupModalFocusTrap,
        setupARIAAnnouncements,
        setupConditionalAnimations,
        setupAnalytics,
        setupPerformanceMonitoring,
        showError,
        debounce
    };

    console.log('✅ Corrections JavaScript chargées. Utilisez window.PEBCalculatorEnhancements pour les appliquer.');

})();

/**
 * ========================================
 * EXEMPLE D'UTILISATION
 * ========================================
 */

/*

// Dans votre code principal, après la définition des éléments :

const enhancements = window.PEBCalculatorEnhancements;

// Appliquer les corrections
enhancements.setupInputValidation(elements, getConfig);
enhancements.setupSliderTooltip(elements);
const showPopup = enhancements.setupSavingsPopupAutoShow(elements, calculatePrice, getConfig);
enhancements.setupSliderInvitation(elements);
enhancements.setupImprovedCTA(elements, getConfig, calculatePrice);
enhancements.setupModalFocusTrap(elements.infoModal);

const aria = enhancements.setupARIAAnnouncements(elements);
// Utiliser aria.announcePrice(...) et aria.announceTabChange(...) selon besoin

enhancements.setupConditionalAnimations();
const analytics = enhancements.setupAnalytics(elements);
enhancements.setupPerformanceMonitoring();

// Modifier updateUIWithAnimation pour annoncer les changements
function updateUIWithAnimation() {
    // ... code existant ...

    // Ajouter l'annonce ARIA
    const promoPrice = calculatePrice(...);
    const surface = parseInt(elements.slider.value);
    aria.announcePrice(promoPrice, surface);
}

// Modifier les tabs pour annoncer les changements
elements.tabsContainer.addEventListener('click', (event) => {
    const tab = event.target.closest('.peb-tab');
    if (!tab || tab.classList.contains('active')) return;

    // ... code existant ...

    // Ajouter l'annonce ARIA
    const config = calculatorsConfig[currentType];
    aria.announceTabChange(config.label);
});

*/
