<?php
/*
Plugin Name: Vndis Lunar Calendar
Plugin URI: http://vndis.net/
Description: Vndis Lunar Calendar Widget
Author: Vndis.net
Version: 1.0.0
Author URI: http://vndis.net
*/
class Vndis_Lunar_Calendar_Widget extends WP_Widget {
	function __construct() 
	{
		parent::__construct(
			'vndis_lunar_calendar_widget', // Base ID
			__( 'Lunar Calendar', 'vndis_lunar_calendar' ), // Name
			array( 'description' => __( 'Vndis Lunar Calendar Widget', 'vndis_lunar_calendar' ), ) // Args
		);
		add_action('wp_enqueue_scripts', array($this, 'register_static'));
	}
	function register_static()
	{
		wp_register_script( 'vndis-lunar-calendar-script', plugins_url( '/static/lunar.min.js', __FILE__),array('jquery-core'), '1.0.0', true);
		wp_enqueue_script(  'vndis-lunar-calendar-script');
		wp_register_style( 'vndis-lunar-calendar-style', plugins_url( '/static/lunar.css', __FILE__));
		wp_enqueue_style(  'vndis-lunar-calendar-style');
	}
	public function widget( $args, $instance ) 
	{
		echo $args['before_widget'];
		if ( ! empty( $instance['title'] ) ) 
		{
			echo $args['before_title'] . apply_filters( 'widget_title', $instance['title'] ). $args['after_title'];
		}
		?>
		<div class="vndis-lunar-calendar"></div>
		<script language="javascript">
			( funtion( $ ){ jQuery('.vndis-lunar-calendar').vndisCalendar() });	
		</script>
		<?php
		echo $args['after_widget'];
	}

	
	public function form( $instance ) 
	{
		$title = ! empty( $instance['title'] ) ? $instance['title'] : __( 'Lunar Calendar', 'vndis_lunar_calendar' );
		?>
		<p>
			<label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:' ); ?></label> 
			<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>">
		</p>
		<?php 
	}
	public function update( $new_instance, $old_instance ) 
	{
		$instance = array();
		$instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( trim($new_instance['title'] ) ) : '';

		return $instance;
	}

}
function register_vndis_lunar_widget() {
    register_widget( 'Vndis_Lunar_Calendar_Widget' );
}
add_action( 'widgets_init', 'register_vndis_lunar_widget' );