(function($) {

	/**
	 * Genera una lista con sangría de los enlaces de un nav. Diseñado para uso con panel().
	 * @return {jQuery} jQuery object.
	 */
	$.fn.navList = function() {

		var	$this = $(this);
			$a = $this.find('a'),
			b = [];

		$a.each(function() {

			var	$this = $(this),
				indent = Math.max(0, $this.parents('li').length - 1),
				href = $this.attr('href'),
				target = $this.attr('target');

			b.push(
				'<a ' +
					'class="link depth-' + indent + '"' +
					( (typeof target !== 'undefined' && target != '') ? ' target="' + target + '"' : '') +
					( (typeof href !== 'undefined' && href != '') ? ' href="' + href + '"' : '') +
				'>' +
					'<span class="indent-' + indent + '"></span>' +
					$this.text() +
				'</a>'
			);

		});

		return b.join('');

	};

	/**
	 * Panel-ify un elemento.
	 * @param {object} userConfig configuración de Usuario.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.panel = function(userConfig) {

		// Ningún elemento?
			if (this.length == 0)
				return $this;

		// Multiples elementos?
			if (this.length > 1) {

				for (var i=0; i < this.length; i++)
					$(this[i]).panel(userConfig);

				return $this;

			}

		// Vars.
			var	$this = $(this),
				$body = $('body'),
				$window = $(window),
				id = $this.attr('id'),
				config;

		// Config.
			config = $.extend({

				// Retrasar.
					delay: 0,

				// Ocultar panel en el enlace haga clic.
					hideOnClick: false,

				// Ocultar panel en la tecla de escape.
					hideOnEscape: false,

				// Ocultar panel en deslizar.
					hideOnSwipe: false,

				// Restablecer la posición de desplazamiento en ocultar.
					resetScroll: false,

				// Restablecer formularios en ocultar.
					resetForms: false,

				// Lado de la ventana de visualización que aparecerá el panel.
					side: null,

				// Elemento de destino para "clase".
					target: $this,

				// Clase para alternar.
					visibleClass: 'visible'

			}, userConfig);

			// Expanda "target" si ya no es un objeto jQuery.
				if (typeof config.target != 'jQuery')
					config.target = $(config.target);

		// Panel.

			// Métodos.
				$this._hide = function(event) {

					// Already hidden? Bail.
						if (!config.target.hasClass(config.visibleClass))
							return;

					// Si se ha proporcionado un evento, anótelo.
						if (event) {

							event.preventDefault();
							event.stopPropagation();

						}

					// Hide.
						config.target.removeClass(config.visibleClass);

					// Post-hide stuff.
						window.setTimeout(function() {

							// Restablecer la posición de desplazamiento.
								if (config.resetScroll)
									$this.scrollTop(0);

							// Restablecer formularios.
								if (config.resetForms)
									$this.find('form').each(function() {
										this.reset();
									});

						}, config.delay);

				};

			// Soluciones de proveedores.
				$this
					.css('-ms-overflow-style', '-ms-autohiding-scrollbar')
					.css('-webkit-overflow-scrolling', 'touch');

			// Ocultar en clic.
				if (config.hideOnClick) {

					$this.find('a')
						.css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');

					$this
						.on('click', 'a', function(event) {

							var $a = $(this),
								href = $a.attr('href'),
								target = $a.attr('target');

							if (!href || href == '#' || href == '' || href == '#' + id)
								return;

							// Cancelar el evento original.
								event.preventDefault();
								event.stopPropagation();

							// Ocultar panel.
								$this._hide();

							// Redireccionar a href.
								window.setTimeout(function() {

									if (target == '_blank')
										window.open(href);
									else
										window.location.href = href;

								}, config.delay + 10);

						});

				}

			// Evento: Toque las cosas.
				$this.on('touchstart', function(event) {

					$this.touchPosX = event.originalEvent.touches[0].pageX;
					$this.touchPosY = event.originalEvent.touches[0].pageY;

				})

				$this.on('touchmove', function(event) {

					if ($this.touchPosX === null
					||	$this.touchPosY === null)
						return;

					var	diffX = $this.touchPosX - event.originalEvent.touches[0].pageX,
						diffY = $this.touchPosY - event.originalEvent.touches[0].pageY,
						th = $this.outerHeight(),
						ts = ($this.get(0).scrollHeight - $this.scrollTop());

					// Hide on swipe?
						if (config.hideOnSwipe) {

							var result = false,
								boundary = 20,
								delta = 50;

							switch (config.side) {

								case 'left':
									result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
									break;

								case 'right':
									result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
									break;

								case 'top':
									result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
									break;

								case 'bottom':
									result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
									break;

								default:
									break;

							}

							if (result) {

								$this.touchPosX = null;
								$this.touchPosY = null;
								$this._hide();

								return false;

							}

						}

					// Evitar el desplazamiento vertical más allá de la parte superior o inferior.
						if (($this.scrollTop() < 0 && diffY < 0)
						|| (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {

							event.preventDefault();
							event.stopPropagation();

						}

				});

			// Evento: Evitar que ciertos eventos dentro del panel borren.
				$this.on('click touchend touchstart touchmove', function(event) {
					event.stopPropagation();
				});

			// Evento: Ocultar panel si se hace clic en una etiqueta de anclaje chico que apunta a su ID.
				$this.on('click', 'a[href="#' + id + '"]', function(event) {

					event.preventDefault();
					event.stopPropagation();

					config.target.removeClass(config.visibleClass);

				});

		// Body.

			// Evento: Ocultar el panel en el Body con clic / toque.
				$body.on('click touchend', function(event) {
					$this._hide(event);
				});

			// Evento: Alternar.
				$body.on('click', 'a[href="#' + id + '"]', function(event) {

					event.preventDefault();
					event.stopPropagation();

					config.target.toggleClass(config.visibleClass);

				});

		// Ventana.

			// Evento: Ocultar en ESC.
				if (config.hideOnEscape)
					$window.on('keydown', function(event) {

						if (event.keyCode == 27)
							$this._hide(event);

					});

		return $this;

	};

	/**
	 * Aplique el atributo "marcador de posición" polyfill a uno o más formularios.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.placeholder = function() {

		// El navegador admite nativamente los marcadores de posición? 
			if (typeof (document.createElement('input')).placeholder != 'undefined')
				return $(this);

		// Ningún elemento?
			if (this.length == 0)
				return $this;

		// Multiples elementos?
			if (this.length > 1) {

				for (var i=0; i < this.length; i++)
					$(this[i]).placeholder();

				return $this;

			}

		// Vars.
			var $this = $(this);

		// Text, TextArea.
			$this.find('input[type=text],textarea')
				.each(function() {

					var i = $(this);

					if (i.val() == ''
					||  i.val() == i.attr('placeholder'))
						i
							.addClass('polyfill-placeholder')
							.val(i.attr('placeholder'));

				})
				.on('blur', function() {

					var i = $(this);

					if (i.attr('name').match(/-polyfill-field$/))
						return;

					if (i.val() == '')
						i
							.addClass('polyfill-placeholder')
							.val(i.attr('placeholder'));

				})
				.on('focus', function() {

					var i = $(this);

					if (i.attr('name').match(/-polyfill-field$/))
						return;

					if (i.val() == i.attr('placeholder'))
						i
							.removeClass('polyfill-placeholder')
							.val('');

				});

		// Password.
			$this.find('input[type=password]')
				.each(function() {

					var i = $(this);
					var x = $(
								$('<div>')
									.append(i.clone())
									.remove()
									.html()
									.replace(/type="password"/i, 'type="text"')
									.replace(/type=password/i, 'type=text')
					);

					if (i.attr('id') != '')
						x.attr('id', i.attr('id') + '-polyfill-field');

					if (i.attr('name') != '')
						x.attr('name', i.attr('name') + '-polyfill-field');

					x.addClass('polyfill-placeholder')
						.val(x.attr('placeholder')).insertAfter(i);

					if (i.val() == '')
						i.hide();
					else
						x.hide();

					i
						.on('blur', function(event) {

							event.preventDefault();

							var x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

							if (i.val() == '') {

								i.hide();
								x.show();

							}

						});

					x
						.on('focus', function(event) {

							event.preventDefault();

							var i = x.parent().find('input[name=' + x.attr('name').replace('-polyfill-field', '') + ']');

							x.hide();

							i
								.show()
								.focus();

						})
						.on('keypress', function(event) {

							event.preventDefault();
							x.val('');

						});

				});

		// Events.
			$this
				.on('submit', function() {

					$this.find('input[type=text],input[type=password],textarea')
						.each(function(event) {

							var i = $(this);

							if (i.attr('name').match(/-polyfill-field$/))
								i.attr('name', '');

							if (i.val() == i.attr('placeholder')) {

								i.removeClass('polyfill-placeholder');
								i.val('');

							}

						});

				})
				.on('reset', function(event) {

					event.preventDefault();

					$this.find('select')
						.val($('option:first').val());

					$this.find('input,textarea')
						.each(function() {

							var i = $(this),
								x;

							i.removeClass('polyfill-placeholder');

							switch (this.type) {

								case 'submit':
								case 'reset':
									break;

								case 'password':
									i.val(i.attr('defaultValue'));

									x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

									if (i.val() == '') {
										i.hide();
										x.show();
									}
									else {
										i.show();
										x.hide();
									}

									break;

								case 'checkbox':
								case 'radio':
									i.attr('checked', i.attr('defaultValue'));
									break;

								case 'text':
								case 'textarea':
									i.val(i.attr('defaultValue'));

									if (i.val() == '') {
										i.addClass('polyfill-placeholder');
										i.val(i.attr('placeholder'));
									}

									break;

								default:
									i.val(i.attr('defaultValue'));
									break;

							}
						});

				});

		return $this;

	};

	/**
	 * Mueve elementos a / desde las primeras posiciones de sus respectivos parientes.
	 * @param {jQuery} $elements Elements (or selector) para mover.
	 * @param {bool} condition Si es true, mueve los elementos a la parte superior. De lo contrario, mueve los elementos de nuevo a sus ubicaciones originales.
	 */
	$.prioritize = function($elements, condition) {

		var key = '__prioritize';

		// Expanda $elements si ya no es un jQuery object.
			if (typeof $elements != 'jQuery')
				$elements = $($elements);

		// Paso a través de los elementos.
			$elements.each(function() {

				var	$e = $(this), $p,
					$parent = $e.parent();

				// Ningún pariente? Bail.
					if ($parent.length == 0)
						return;

				// No se movió? Muévalo.
					if (!$e.data(key)) {

						// La condición es falsa? 
							if (!condition)
								return;

						// Obtener un marcador de posición (que servirá como nuestro punto de referencia para cuando este elemento necesita retroceder).
							$p = $e.prev();

							// No pudo encontrar nada? Significa que este elemento ya está en la parte superior.
								if ($p.length == 0)
									return;

						// Mover el elemento a la parte superior de los parientes.
							$e.prependTo($parent);

						// Marca el elemento como movido.
							$e.data(key, $p);

					}

				// Ya se movió?
					else {

						// La condición es verdadera?
							if (condition)
								return;

						$p = $e.data(key);

						// Mover el elemento de nuevo a su ubicación original (utilizando nuestro marcador de posición).
							$e.insertAfter($p);

						// Desmarca el elemento como movido.
							$e.removeData(key);

					}

			});

	};

})(jQuery);