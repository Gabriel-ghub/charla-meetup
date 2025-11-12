import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from "@wordpress/block-editor";
import { Button } from "@wordpress/components";
import "./editor.scss";

export default function Edit({ attributes, setAttributes }) {
	const { videoUrl } = attributes;

	const onSelectImage = (media) => {
		setAttributes({ videoUrl: media.url });
	};
	return (
		<>
			<InspectorControls></InspectorControls>
			<div {...useBlockProps()}>
				<div className="meetup-block-image">
					<MediaUploadCheck>
						<MediaUpload
							onSelect={onSelectImage}
							allowedTypes={["image", "video"]}
							value={videoUrl}
							render={({ open }) => (
								<>
									{videoUrl ? (
										<>
											<video
												src={videoUrl}
												controls
												alt={__("Selected video", "text-domain")}
											/>
											<Button onClick={open} variant="secondary">
												{__("Cambiar video", "text-domain")}
											</Button>
										</>
									) : (
										<Button onClick={open} variant="primary">
											{__("Seleccionar video", "text-domain")}
										</Button>
									)}
								</>
							)}
						/>
					</MediaUploadCheck>
					{videoUrl && <button className="video-button">Play Video</button>}
				</div>
			</div>
		</>
	);
}
