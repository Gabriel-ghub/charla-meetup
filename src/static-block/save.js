import { useBlockProps } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";

export default function save({ attributes }) {
	const { videoUrl } = attributes;

	return (
		<div {...useBlockProps.save()}>
			<div
				className="meetup-block-image"
				data-wp-interactive="interactivityblock"
				data-wp-context='{ "isPlaying": false, "buttonText": "Play Video" }'
				data-wp-watch="callbacks.logIsPlaying"
			>
				{videoUrl && (
					<video
						src={videoUrl}
						data-wp-bind--aria-play="context.isPlaying"
						aria-label={__("Selected video", "text-domain")}
					/>
				)}
				{videoUrl && (
					<button
						data-wp-class--video-button--pause="!context.isPlaying"
						className="video-button"
						data-wp-on--click="actions.togglePlay"
						data-wp-text="context.buttonText"
					></button>
				)}
			</div>
		</div>
	);
}
