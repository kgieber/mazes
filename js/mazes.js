// parameters
var rows = 12,
	cols =  16,
	type = 'lg',
	maze_state = 'build';
	
// $("#grlarge").prop("checked", true);
// $("#grsmall").prop("checked", false);
rebuildGrid();

// radio button control for switching the grid size
$('#grlarge').change(function() {
	rows = 12,
	cols =  16,
	type = 'lg';
	rebuildGrid();		
});	
$('#grsmall').change(function() {
	rows = 24,
	cols =  32,
	type = 'sm';
	rebuildGrid();		
});	

// used in the building mode when the buttons are selected
function swapBlocks(block) {
	if(block.hasClass('green-lego')) {
		block.removeClass('green-lego');
		block.attr('aria-label', (block.attr('name') + 'empty'));
	}
	else {
		block.addClass('green-lego');
		block.attr('aria-label', (block.attr('name') + 'lego'));
	}		
};

// used to build the grid
function rebuildGrid() {
	var	i = 0,
		j = 0;
	$('#maze-board').html('');
	for(; i < rows; ++i) {
		var newdiv = '<div>';
		j = 0;
		for(; j < cols; ++j) {
			var btn_name = 'row '+(i+1)+' column '+(j+1) + ' ',
				newbtn = '';
			// check for exit point
			if((i === 0) && (j === (cols - 1))) {
				newbtn = '<button class="game-block-'+type+'" id="end-btn" aria-label="' + btn_name + 'end point" name="' + btn_name + '"/>';
			}
			// check for entrance point
			else if((j === 0) && (i === (rows - 1))) {
				newbtn = '<button class="game-block-'+type+'" id="start-btn" aria-label="' + btn_name + 'start point" name="' + btn_name + '"/>';			
			}
			else {
				newbtn = '<button class="game-block-'+type+'" aria-label="' + btn_name + 'empty" name="' + btn_name + '"/>';
			}
			newdiv += newbtn;
		}
		newdiv += '</div>';
		$('#maze-board').append(newdiv);
		// disable end and start buttons
		$('#end-btn').prop("disabled", true);
		$('#start-btn').prop("disabled", true);
	}
	
	$('.game-block-'+type).click(function(ev) {
		swapBlocks($(this));
	});
}
