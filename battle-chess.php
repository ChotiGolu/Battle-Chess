<?php
/**
 * Plugin Name: Battle Chess
 * Plugin URI:  https://github.com/chotigolu/battle-chess
 * Description: A nostalgic 1980s/1990s Mac OS Battle Chess game — animated piece characters do battle on a classic chess board. Use shortcode [battle_chess] anywhere on your site.
 * Version:     1.0.0
 * Author:      Battle Chess Plugin
 * License:     GPL v2 or later
 * Text Domain: battle-chess
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'BATTLE_CHESS_VERSION', '1.0.0' );
define( 'BATTLE_CHESS_PATH', plugin_dir_path( __FILE__ ) );
define( 'BATTLE_CHESS_URL', plugin_dir_url( __FILE__ ) );

class Battle_Chess_Plugin {

	public function __construct() {
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		add_shortcode( 'battle_chess', [ $this, 'render_shortcode' ] );
		add_action( 'admin_menu', [ $this, 'add_admin_page' ] );
	}

	public function enqueue_assets() {
		global $post;
		$should_load = is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'battle_chess' );

		if ( ! $should_load && ! is_admin() ) {
			// Also load on pages that use Gutenberg blocks or widgets
			$should_load = true;
		}

		if ( $should_load ) {
			wp_enqueue_style(
				'battle-chess-style',
				BATTLE_CHESS_URL . 'assets/css/battle-chess.css',
				[],
				BATTLE_CHESS_VERSION
			);
			wp_enqueue_script(
				'battle-chess-script',
				BATTLE_CHESS_URL . 'assets/js/battle-chess.js',
				[],
				BATTLE_CHESS_VERSION,
				true
			);
			wp_localize_script( 'battle-chess-script', 'BattleChessConfig', [
				'pluginUrl' => BATTLE_CHESS_URL,
				'version'   => BATTLE_CHESS_VERSION,
			] );
		}
	}

	public function render_shortcode( $atts ) {
		$atts = shortcode_atts( [
			'difficulty' => 'medium',
			'side'       => 'white',
			'theme'      => 'mac',
		], $atts, 'battle_chess' );

		wp_enqueue_style( 'battle-chess-style' );
		wp_enqueue_script( 'battle-chess-script' );

		$difficulty = sanitize_text_field( $atts['difficulty'] );
		$side       = sanitize_text_field( $atts['side'] );
		$theme      = sanitize_text_field( $atts['theme'] );

		$depth_map = [
			'easy'   => 1,
			'medium' => 2,
			'hard'   => 3,
		];
		$depth = isset( $depth_map[ $difficulty ] ) ? $depth_map[ $difficulty ] : 2;

		ob_start();
		?>
		<div class="bc-plugin-wrapper"
		     data-bc-depth="<?php echo esc_attr( $depth ); ?>"
		     data-bc-side="<?php echo esc_attr( $side ); ?>"
		     data-bc-theme="<?php echo esc_attr( $theme ); ?>">
			<div id="bc-game-<?php echo esc_attr( uniqid() ); ?>" class="bc-game-container">
				<noscript>
					<p class="bc-noscript">Battle Chess requires JavaScript to play.</p>
				</noscript>
			</div>
		</div>
		<script>
		(function() {
			var wrapper = document.currentScript.previousElementSibling;
			var container = wrapper.querySelector('.bc-game-container');
			var depth = parseInt(wrapper.getAttribute('data-bc-depth') || '2');
			var side  = wrapper.getAttribute('data-bc-side') || 'white';
			if (typeof BattleChess !== 'undefined') {
				BattleChess.init(container, { depth: depth, playerSide: side });
			} else {
				document.addEventListener('DOMContentLoaded', function() {
					if (typeof BattleChess !== 'undefined') {
						BattleChess.init(container, { depth: depth, playerSide: side });
					}
				});
			}
		})();
		</script>
		<?php
		return ob_get_clean();
	}

	public function add_admin_page() {
		add_menu_page(
			'Battle Chess',
			'Battle Chess',
			'manage_options',
			'battle-chess',
			[ $this, 'render_admin_page' ],
			'dashicons-games',
			99
		);
	}

	public function render_admin_page() {
		?>
		<div class="wrap">
			<h1>⚔️ Battle Chess</h1>
			<div class="card" style="max-width:600px; padding:20px;">
				<h2>How to Use</h2>
				<p>Add the shortcode <code>[battle_chess]</code> to any post or page to embed the game.</p>
				<h3>Shortcode Options</h3>
				<table class="widefat" style="max-width:500px;">
					<thead>
						<tr><th>Attribute</th><th>Values</th><th>Default</th></tr>
					</thead>
					<tbody>
						<tr><td><code>difficulty</code></td><td>easy, medium, hard</td><td>medium</td></tr>
						<tr><td><code>side</code></td><td>white, black</td><td>white</td></tr>
					</tbody>
				</table>
				<h3>Examples</h3>
				<code>[battle_chess]</code><br><br>
				<code>[battle_chess difficulty="hard" side="white"]</code><br><br>
				<h2>About Battle Chess</h2>
				<p>Recreating the classic 1988 Interplay Productions game for Mac OS. Each chess piece is an animated character — pawns are armored warriors, rooks are stone golems, bishops are wizards, queens are sorceresses, and kings are noble warriors. When a piece captures another, watch the battle unfold!</p>
			</div>
		</div>
		<?php
	}
}

new Battle_Chess_Plugin();
