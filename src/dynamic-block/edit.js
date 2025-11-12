/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, TextControl } from "@wordpress/components";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { maps_api_key, place } = attributes;

	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__("Configuración de Google Reviews", "meet-up-blocks")}
					initialOpen={true}
				>
					<TextControl
						label={__("API Key de Google Maps", "meet-up-blocks")}
						type="password"
						value={maps_api_key}
						onChange={(value) => setAttributes({ maps_api_key: value })}
						help={__(
							"Se usará en el servidor para llamar a la API de Places.",
							"meet-up-blocks",
						)}
					/>

					<TextControl
						label={__("Place ID del negocio", "meet-up-blocks")}
						value={place}
						onChange={(value) => setAttributes({ place: value })}
						help={__(
							"Introduce el Place ID de Google del sitio cuyas reseñas quieres mostrar.",
							"meet-up-blocks",
						)}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<p>
					{__(
						"Este bloque mostrará las reseñas de Google en el frontal.",
						"meet-up-blocks",
					)}
				</p>

				{!maps_api_key && (
					<p>
						{__("⚠ Añade tu API key en el panel lateral.", "meet-up-blocks")}
					</p>
				)}

				{maps_api_key && !place && (
					<p>{__("⚠ Falta el Place ID.", "meet-up-blocks")}</p>
				)}
			</div>
		</>
	);
}
