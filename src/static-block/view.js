/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

/* eslint-disable no-console */
console.log("Hello World! (from create-block-meetup-block block)");
/* eslint-enable no-console */

// import { registerFormatType, toggleFormat } from "@wordpress/rich-text";
// import { RichTextToolbarButton } from "@wordpress/block-editor";
// import { useSelect } from "@wordpress/data";
import { store, getContext } from "@wordpress/interactivity";

// function ConditionalButton({ isActive, onChange, value }) {
// 	const selectedBlock = useSelect((select) => {
// 		return select("core/block-editor").getSelectedBlock();
// 	}, []);

// 	if (selectedBlock && selectedBlock.name !== "core/paragraph") {
// 		return null;
// 	}

// 	return (
// 		<RichTextToolbarButton
// 			icon="editor-code"
// 			title="Sample output"
// 			onClick={() => {
// 				onChange(
// 					toggleFormat(value, {
// 						type: "my-custom-format/sample-output",
// 					}),
// 				);
// 			}}
// 			isActive={isActive}
// 		/>
// 	);
// }

// registerFormatType("my-custom-format/sample-output", {
// 	title: "Sample output",
// 	tagName: "samp",
// 	className: null,
// 	edit: ConditionalButton,
// });

store("interactivityblock", {
	actions: {
		togglePlay: () => {
			const context = getContext();
			context.isPlaying = !context.isPlaying;
			context.buttonText = context.isPlaying ? "Pause Video" : "Play Video";
			const video = document.querySelector(".meetup-block-image video");
			if (video) {
				if (context.isPlaying) {
					video.play();
				} else {
					video.pause();
				}
			}
		},
	},
	callbacks: {
		logIsPlaying: () => {
			const { isPlaying } = getContext();
			// Log the value of `isPlaying` each time it changes.
			console.log(`Is playing: ${isPlaying}`);
		},
	},
});
