// parameters
var rows = 12,
	cols =  16,
	type = 'lg',
	maze_state = 'build',
	pos_col= 0,
	pos_row = 0,
	ball_col = 0,
	ball_row = 0,
	has_won = false,
	timer_visible = false,
	init_timer = false,
	start_time = 0,
	timer_running = false,
	allow_repeat = false,
	key_wait = false,
	did_move = false,
	delay_timer;

// set up sounds
var sfx_hit = new Howl({
      src: ['audio/sfx_hit.mp3', 'audio/sfx_hit.ogg']
    });
var sfx_bonk = new Howl({
      src: ['audio/sfx_hollowbonk.mp3', 'audio/sfx_hollowbonk.ogg']
    });
var sfx_win = new Howl({
      src: ['audio/sfx_dings.mp3', 'audio/sfx_dings.ogg']
    });
var sfx_pop = new Howl({
      src: ['audio/sfx_pop.mp3', 'audio/sfx_pop.ogg']
    });
var sfx_puff = new Howl({
      src: ['audio/sfx_puff.mp3', 'audio/sfx_puff.ogg']
    });
var sfx_build = new Howl({
      src: ['audio/sfx_build.mp3', 'audio/sfx_build.ogg']
    });
var sfx_click = new Howl({
      src: ['audio/sfx_click.mp3', 'audio/sfx_click.ogg']
    });
var sfx_move = new Howl({
      src: ['audio/sfx_click_light.mp3', 'audio/sfx_click_light.ogg']
    });
 
// screen setup *********************************************************************
    
rebuildGrid();

$('#maze-timer').removeClass('hidden');
$('#maze-timer').hide();
$('#bt-hdtimer').removeClass('hidden');
$('#bt-hdtimer').hide();
$('#bt-timer').removeClass('hidden');
$('#bt-timer').hide();
$('#hdr-play').removeClass('hidden');
$('#hdr-play').hide();
$('#bt-restart').removeClass('hidden');
$('#bt-restart').hide();
$('#maze-instr-play').removeClass('hidden');
$('#maze-instr-play').hide();
$('#maze-win').removeClass('hidden');
$('#maze-win').hide();
$('#mzview-kbinfo').removeClass('hidden');
$('#mzview-kbinfo').hide();
$('#bt-build').prop("disabled", true);

// listeners for check button control for key repeat ********************************
$('#repeat-box').prop("checked", true);
allow_repeat = true;

$('#repeat-box').change(function() {
	if(this.checked) {
		allow_repeat = true;
		key_wait = false;
	}
	else {
		allow_repeat = false;	
	}
});	

// listeners for radio button control to switch the grid size
/*
// $("#grlarge").prop("checked", true);
// $("#grsmall").prop("checked", false);
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
*/

// listeners for nav buttons ********************************************************

$('#bt-play').click(function() {
	switchToPlay();
});
$('#bt-build').click(function() {
	switchToBuild();
});
$('#bt-restart').click(function() {
	restartCurrentPlay();
});
$('#bt-timer').click(function() {
	showGameTimer();
});
$('#bt-hdtimer').click(function() {
	hideGameTimer();
});
$('#bt-shortcuts').click(function() {
	sfx_click.play();
	$('#bt-shortcuts').hide();
	$('#mzview-kbinfo').show();
});
$('#bt-close').click(function() {
	sfx_click.play();
	$('#bt-shortcuts').show();
	$('#mzview-kbinfo').hide();
});

// listener for keypresses **********************************************************

$(document).keydown(function(ev) {
	if(!allow_repeat && key_wait) {return;}
	did_move = true;
	// check for the different directions
	switch(ev.which) {
	case 37:
		// left
		ev.preventDefault();
		if(maze_state === 'build') {
			--pos_col;
			if(pos_col < 1) {
				sfx_bonk.play();
				pos_col = 1;
				did_move = false;
			}
			// make sure rows is also ready
			if(pos_row < 1) {
				pos_row = 1;
			}
			// don't move if at start point
			if((pos_row === rows) && (pos_col === 1)) {
				pos_col = 2;
				did_move = false;
			}
			$('#r'+pos_row.toString()+'c'+pos_col.toString()).focus();
			if(did_move) {
				sfx_move.play();			
			}
		}
		else {
			attemptMove(ball_col - 1, ball_row);
		}
		key_wait = true;
		break;
	case 38:
		// top
		ev.preventDefault();
		if(maze_state === 'build') {
			--pos_row;
			if(pos_row < 1) {
				sfx_bonk.play();
				pos_row = 1;
				did_move = false;
			}
			// make sure cols is also ready
			if(pos_col < 1) {
				pos_col = 1;
			}
			// don't move if at end point
			if((pos_row === 1) && (pos_col === cols)) {
				pos_row = 2;
				did_move = false;
			}
			$('#r'+pos_row.toString()+'c'+pos_col.toString()).focus();
			if(did_move) {
				sfx_move.play();			
			}
		}
		else {
			attemptMove(ball_col, ball_row - 1);
		}
		key_wait = true;
		break;
	case 39:
		// right
		ev.preventDefault();
		if(maze_state === 'build') {
			++pos_col;
			if(pos_col > cols) {
				sfx_bonk.play();
				pos_col = cols;
				did_move = false;
			}
			// make sure rows is also ready
			if(pos_row < 1) {
				pos_row = 1;
			}
			// don't move if at end point
			if((pos_row === 1) && (pos_col === cols)) {
				pos_col = cols - 1;
				did_move = false;
			}
			$('#r'+pos_row.toString()+'c'+pos_col.toString()).focus();
			if(did_move) {
				sfx_move.play();			
			}
		}
		else {
			attemptMove(ball_col + 1, ball_row);
		}
		key_wait = true;
		break;
	case 40:
		// down
		ev.preventDefault();
		if(maze_state === 'build') {
			++pos_row;
			if(pos_row > rows) {
				sfx_bonk.play();
				pos_row = rows;
				did_move = false;
			}
			// make sure cols is also ready
			if(pos_col < 1) {
				pos_col = 1;
			}
			// don't move if at start point
			if((pos_row === rows) && (pos_col === 1)) {
				pos_row = rows - 1;
				did_move = false;
			}
			$('#r'+pos_row.toString()+'c'+pos_col.toString()).focus();
			if(did_move) {
				sfx_move.play();			
			}
		}
		else {
			attemptMove(ball_col, ball_row + 1);		
		}
		key_wait = true;
		break;
	// KEYSTROKE ACCESSIBILITY	
	case 66:
		if(maze_state === 'play') {
			switchToBuild();
		}
		break;
	case 80:
		if(maze_state === 'build') {
			switchToPlay();
		}
		break;
	case 82:
		if(maze_state === 'play') {
			restartCurrentPlay();		
		}
		break;
	case 75:
		if(allow_repeat) {
			allow_repeat = false;
			$('#repeat-box').prop("checked", false);
		}
		else {
			allow_repeat = true;	
			key_wait = false;
			$('#repeat-box').prop("checked", true);
		}
		break;
	case 84:
		if(maze_state === 'play') {
			if(timer_visible) {
				hideGameTimer();						
			}
			else {
				showGameTimer();						
			}
		}
		break;
	case 83:
		sfx_click.play();
		if($('#mzview-kbinfo').is(':visible')) {
			$('#mzview-kbinfo').hide();
			$('#bt-shortcuts').show();
		}
		else {
			$('#mzview-kbinfo').show();
			$('#bt-shortcuts').hide();
		}
		break;
	default:
		// do nothing
		break;	
	}
});

// listener for keypresses
$(document).keyup(function(ev) {
	if(!allow_repeat && key_wait) {
		key_wait = false;
	}
});

// functions ************************************************************************

// used to switch to build mode
function switchToBuild() {
	sfx_click.play();
	$('#bt-play').prop("disabled", false);
	$('#bt-build').prop("disabled", true);
	$('#bt-restart').hide();
	$('#hdr-play').hide();
	$('#hdr-build').show();
	$('#maze-instr-build').show();
	$('#maze-instr-play').hide();
	$('#maze-win').hide();
	maze_state = 'build';
	clearBall();
	$('#r' + rows.toString() + 'c1').addClass('start-btn');
	$('#r' + rows.toString() + 'c1').attr('aria-label', ($('#r' + rows.toString() + 'c1').attr('name') + 'start point'));
	// hide timer
	$('#maze-timer').hide();
	$('#bt-timer').hide();
	$('#bt-hdtimer').hide();
	if(timer_running) {
		clearInterval(delay_timer);
		timer_running = false;
	}
}

// used to switch to play mode
function switchToPlay() {
	sfx_click.play();
	maze_state = 'play';
	$('#bt-play').prop("disabled", true);
	$('#bt-build').prop("disabled", false);
	$('#bt-restart').show();
	$('#hdr-play').show();
	$('#hdr-build').hide();
	$('#maze-instr-build').hide();
	$('#maze-instr-play').show();
	// check status of timer
	if(timer_visible) {
		$('#maze-timer').show();
		$('#bt-hdtimer').show();
	}
	else {
		$('#bt-timer').show();	
	}
	restartPlay();
}

// used to restart play
function restartCurrentPlay() {
	sfx_click.play();
	restartPlay();
}

// used to show the timer
function showGameTimer() {
	sfx_click.play();
	$('#maze-timer').show();
	$('#bt-timer').hide();
	$('#bt-hdtimer').show();
	timer_visible = true;
	if(!timer_running) {
		init_timer = true;
		start_time = 0;
		curr_time = 0;
		$('#maze-time').html('00:00');
	}
}

// used to hide the timer
function hideGameTimer() {
	sfx_click.play();
	$('#maze-timer').hide();
	$('#bt-timer').show();
	$('#bt-hdtimer').hide();
	timer_visible = false;
}

// used in the building mode when the buttons are selected
function swapBlocks(block) {
	if(block.hasClass('green-lego')) {
		block.removeClass('green-lego');
		block.attr('aria-label', (block.attr('name') + 'empty'));
		sfx_pop.play();
	}
	else {
		block.addClass('green-lego');
		block.attr('aria-label', (block.attr('name') + 'lego'));
		sfx_build.play();
	}		
};

// used to build the grid
function rebuildGrid() {
	var	i = 1,
		j = 1,
		ctr = 0;
	$('#maze-board').html('');
	for(; i <= rows; ++i) {
		var newdiv = '<div>';
		j = 1;
		for(; j <= cols; ++j) {
			var btn_name = 'row ' + i.toString() + ' column ' + j.toString() + ' ',
				btn_id = 'r' + i.toString() + 'c' + j.toString(),
				newbtn = '';
			++ctr;
			// check for exit point
			if((i === 1) && (j === cols)) {
				newbtn = '<button class="game-block-'+type+' end-btn" id="' + btn_id + '" aria-label="' + btn_name + 'end point" name="' + btn_name + '" tabindex="' + (100 + ctr).toString() + '" />';
			}
			// check for entrance point
			else if((j === 1) && (i === rows)) {
				newbtn = '<button class="game-block-'+type+' start-btn" id="' + btn_id + '" aria-label="' + btn_name + 'start point" name="' + btn_name + '" tabindex="' + (100 + ctr).toString() + '" />';			
			}
			else {
				newbtn = '<button class="game-block-'+type+'" id="' + btn_id + '" aria-label="' + btn_name + 'empty" name="' + btn_name + '" tabindex="' + (100 + ctr).toString() + '" />';
			}
			newdiv += newbtn;
		}
		newdiv += '</div>';
		$('#maze-board').append(newdiv);
	}
	
	// disable end and start buttons
	$('.end-btn').prop("disabled", true);
	$('.start-btn').prop("disabled", true);
	
	// listeners for grid blocks
	$('.game-block-'+type).click(function(ev) {
		if(maze_state === 'build') {
			var id_str = $(this).attr('id'),
				cl_ptr = id_str.indexOf('c');
			pos_row = parseInt(id_str.substring(1, cl_ptr), 10);
			pos_col = parseInt(id_str.substr(cl_ptr + 1, 10));
			swapBlocks($(this));
		}
		else {
			// do nothing	
		}
	});
	$('.game-block-'+type).focus(function(ev) {
		if(maze_state === 'build') {
			var id_str = $(this).attr('id'),
				cl_ptr = id_str.indexOf('c');
			pos_row = parseInt(id_str.substring(1, cl_ptr), 10);
			pos_col = parseInt(id_str.substr(cl_ptr + 1, 10));
		}
		else {
		
		}
	});
}

// used to clear the ball from the blocks when returning to build mode
function clearBall() {
	var	i = 1,
		j = 1;
	for(; i <= rows; ++i) {
		var newdiv = '<div>';
		j = 1;
		for(; j <= cols; ++j) {
			var block_id = '#r' + i.toString() + 'c' + j.toString();
			if($(block_id).hasClass('has-ball')) {
				$(block_id).removeClass('has-ball');
				$(block_id).attr('aria-label', ($(block_id).attr('name') + 'empty'));
			}
		}
	}
}

// used to check if this is a spot that can have the ball
function attemptMove(clsp, rwsp) {
	var no_move = false,
		chk_id = '#r' + rwsp.toString() + 'c' + clsp.toString();
	// check if game is already won
	if(has_won) {
		// don't move anymore
		return;
	}
	// check for winning
	if((clsp === cols) && (rwsp === 1)) {
		clearBall();
		if(timer_running) {
			clearInterval(delay_timer);
			timer_running = false;
		}
		$('#maze-win').show();
		sfx_win.play();
		has_won = true;
		return;
	}
	// check whether to start timer	
	if(init_timer) {
		init_timer = false;
		start_time = Date.now();
		timer_running = true;
		// start ongoing timer
		delay_timer = window.setInterval(incrementTimer, 500);
	}
	// check for move
	if(rwsp < 1 || clsp < 1 || rwsp > rows || clsp > cols) {
		no_move = true;
		sfx_bonk.play();
	}
	if($(chk_id).hasClass('green-lego')) {
		no_move = true;
		sfx_hit.play();
	}
	if(!no_move) {
		sfx_puff.play();
		clearBall();
		$(chk_id).addClass('has-ball');
		$(chk_id).attr('aria-label', ($(chk_id).attr('name') + 'ball'));
		ball_row = rwsp;
		ball_col = clsp;
	}
	else {
//		console.log('>>>> CANT MOVE');
	}
}

// used to increment the timer when the maze is being played
function incrementTimer() {
	var cr_time = Date.now(),
		df_time = Math.floor((cr_time - start_time) / 1000),
		tmin = Math.floor(df_time / 60),
		tsec = df_time % 60,
		time_str = '';
	// check if time is longer than what will be displayed
	if(df_time > 3599) {
		$('#maze-time').html('59:59');
	}
	else {
		if(tmin < 10) {
			time_str += '0' + tmin.toString();		
		}
		else {
			time_str += tmin.toString();		
		}
		time_str += ':';
		if(tsec < 10) {
			time_str += '0' + tsec.toString();		
		}
		else {
			time_str += tsec.toString();		
		}
		$('#maze-time').html(time_str);
	}
}

// used to restart the play round
function restartPlay() {
	has_won = false;
	if(timer_visible) {
		init_timer = true;
		start_time = 0;
		curr_time = 0;
		$('#maze-time').html('00:00');
	};
	if(timer_running) {
		clearInterval(delay_timer);
		timer_running = false;
	}
	clearBall();
	$('#maze-win').hide();
	var start_id = '#r' + rows.toString() + 'c1';
	// set start points
	if($(start_id).hasClass('start-btn')) {
		$(start_id).removeClass('start-btn');
	}
	if($(start_id).removeClass('has-ball')) {
		$(start_id).addClass('has-ball');
	}
	$(start_id).attr('aria-label', ($(start_id).attr('name') + 'ball'));
	ball_col = 1;
	ball_row = rows;
}


