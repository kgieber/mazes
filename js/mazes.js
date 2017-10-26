var rows = 12,
	col =  16,
	type = 'lg';
	
$("#grlarge").prop("checked", true);
$("#grsmall").prop("checked", false);
rebuildGrid();

$('#grlarge').change(function() {
	rows = 12,
	col =  16,
	type = 'lg';
	rebuildGrid();		
});	
$('#grsmall').change(function() {
	rows = 24,
	col =  32,
	type = 'sm';
	rebuildGrid();		
});	

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

function rebuildGrid() {
	var	i = 0,
		j = 0;
	$('#maze-board').html('');
	for(; i < rows; ++i) {
	console.log('ADDING A ROW: '+i);
		var newdiv = '<div>';
		j = 0;
		for(; j < col; ++j) {
			var btn_name = 'row '+(i+1)+' col '+(j+1) + ' ';
				newbtn = '<button class="game-block-'+type+'" aria-label="' + btn_name + 'empty" name="' + btn_name + '"/>';
			newdiv += newbtn;
		}
		newdiv += '</div>';
		$('#maze-board').append(newdiv);
	}
	
	$('.game-block-'+type).click(function(ev) {
		swapBlocks($(this));
	});
}
