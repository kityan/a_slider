(function($){
$.fn.a_slider = function(data) {  

	var isTouchDevice = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));

	// конфигурация по умолчанию
	var config = $.extend(true, {
		ticks: 5,				// количество позиций
		initalTick: 1,			// начальная позиция бегунка
		bar: {side: '40px'},	// размеры бегунка
		width: 'auto',			// ширина контейнера
		track: {height: '5px'},	// размеры дорожки
	}, data);
	
    return this.each(function() {        
		
		// указатель на jQuery-объект HTML-элемента
		var container;	
		// указатель на перетаскиваемый объект, используется только 
		var globalDragObject;
		// массив x-координат. Обновляется каждый раз перед началом нового сеанса перетаскивания: _updateTicksCoords();
		var ticksCoords;
		// текущий индекс позиции бегунка
		var currSnapToIndex;
	
		var methods = {
			getValue: getValue,
			setValue: setValue,
			init: init
		};			
		
		if (typeof options == 'string' && methods[options]) {
			config = this.config;
			return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
		} 
		else {
			return methods['init'].apply(this, arguments);
		}
		

		// ---------------------------------------
		// актуализируем коордианты, которые могли измениться из-за reflow.
		function _updateTicksCoords(){
			ticksCoords = [];
			var ticks = container.find('.tick');
			for (var i=0, qty = ticks.length; i < qty; i++){
				ticksCoords.push($(ticks[i]).offset().left);
			}
		}
		
		// обработка перемещения мыши в окне
		function _onDocumentMouseMove(e, a){
			if (globalDragObject){
				e.preventDefault();
				if ((typeof e.buttons == 'undefined' && e.which == 0) || (e.buttons == 0)){	// предотвращение "залипания" drag-а в случае, если клавиша мыши была отпущена не над drag-объектом
					globalDragObject = undefined;
				} else {
					_moveBar(e.pageX);
				}				
			}	
		}

		function _moveBar(dragX, dragObject){
			// ищем крайнюю позицию, к которой можем сделать snap (ищем слева направо)
			var snapToIndex = 0;
			for (var i=0, qty = ticksCoords.length; i < qty-1; i++){
				snapToIndex = (dragX >= (ticksCoords[i+1] + ticksCoords[i])/2) ? i+1 : snapToIndex;
			}
			// делаем snap
			if (currSnapToIndex != snapToIndex){
				currSnapToIndex = snapToIndex;
				dO = (!isTouchDevice) ? globalDragObject : $(dragObject);
				dO.parent().css('margin-left', (100/(config.ticks-1))*(currSnapToIndex) + '%');
			}
		}
		
		
		function _onBarMouseDown(e){
			_updateTicksCoords();
			globalDragObject = $(this);
		}			
		
		function _onBarMouseUp(e){
			globalDragObject = undefined;
		}
		
		function _onBarTouchStart(e){
			_updateTicksCoords();
		}
		
		function _onBarTouchMove(e){
			e.preventDefault();
			_moveBar(e.originalEvent.targetTouches[0].pageX, this)
		}					
		
		
		// ---------------------------------------


		// инициализация
		function init() {
			
			// получаем половину ширины бегунка, чтобы установить отступы
			var barSideHalf = Math.round(parseInt(config.bar.side)/2) + 'px';
			// % длины дорожки на расстояние между шагами
			var tickStep = 100 / (config.ticks-1);
			
			var ticksHTML = '';
			for (var i = 0; i < config.ticks; i++){
				ticksHTML += '<div class="tick" data-index="'+i+'" style="\
					margin-left: ' + tickStep*i + '%;\
					height: ' + config.bar.side + ';\
				"></div>';
			}
			
			currSnapToIndex = config.initalTick-1;
			
			container = $(this)
				.addClass('a_slider')
				.css({
					width: config.width,
					paddingRight: barSideHalf,
					paddingLeft: barSideHalf,
					height: config.bar.side,
					minWidth: (config.ticks-1)*parseInt(config.bar.side) + 'px'
				})
				.html('\
						<div class="padding" style="width: ' + barSideHalf + ';"></div>\
						<div class="wrapper">\
							<div class="track" style="\
								height: ' + config.track.height + ';\
								top: ' + Math.round((parseInt(config.bar.side) - parseInt(config.track.height))/2) + 'px;\
								"></div>' + ticksHTML + '\
							<div class="barWrapper" style="margin-left: ' + tickStep*(currSnapToIndex) + '%;">\
								<div class="bar" style="\
									margin-left: -' + barSideHalf + ';\
									height: ' + config.bar.side + ';\
									width: ' + config.bar.side + ';\
									border-radius:  ' + config.bar.side + ';\
								"></div>\
							</div>\
						</div>\
						<div class="padding" style="width: ' + barSideHalf + ';"></div>\
				');
				
			var bar = container.find('.bar');
			if (!isTouchDevice){
				$(document).on('mousemove', _onDocumentMouseMove);
				bar
					.on('mousedown', _onBarMouseDown)
					.on('mouseup', _onBarMouseUp);
			} else {
				bar
					.on('touchstart', _onBarTouchStart)
					.on('touchmove', _onBarTouchMove);
			}
		return container;
		}		
		

		function destroy() {
			// 2do
		}

		
		function getValue() {
			// 2do		
			
		}

		function setValue() {
			// 2do		
		}
	
		
		// ---------------------------------------				
		
		
	
	});


}})(jQuery);
