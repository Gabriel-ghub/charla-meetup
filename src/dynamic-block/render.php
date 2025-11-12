<?php

$api_key    = isset($attributes['maps_api_key']) ? sanitize_text_field($attributes['maps_api_key']) : '';
$place_name = isset($attributes['place']) ? sanitize_text_field($attributes['place']) : '';

if (empty($api_key) || empty($place_name)) {
    return '<p>' . esc_html__('Configura la API key y el nombre del lugar en el editor del bloque.', 'meet-up-blocks') . '</p>';
}


$findplace_endpoint = add_query_arg(
    array(
        'input'     => $place_name,
        'inputtype' => 'textquery',
        'fields'    => 'place_id',
        'language'  => 'es',
        'key'       => $api_key,
    ),
    'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
);

$findplace_response = wp_remote_get(
    $findplace_endpoint,
    array(
        'timeout' => 10,
    )
);

if (is_wp_error($findplace_response)) {
    return '<p>' . esc_html__('No se pudo resolver el lugar a partir del nombre proporcionado.', 'meet-up-blocks') . '</p>';
}

$findplace_body = wp_remote_retrieve_body($findplace_response);
$findplace_data = json_decode($findplace_body, true);

if (
    empty($findplace_data)
    || ! isset($findplace_data['status'])
    || 'OK' !== $findplace_data['status']
    || empty($findplace_data['candidates'])
    || empty($findplace_data['candidates'][0]['place_id'])
) {
    return '<p>' . esc_html__('No se encontró ningún lugar que coincida con ese nombre.', 'meet-up-blocks') . '</p>';
}

$place_id = $findplace_data['candidates'][0]['place_id'];

$details_endpoint = add_query_arg(
    array(
        'place_id' => $place_id,
        'fields'   => 'name,rating,user_ratings_total,reviews',
        'language' => 'es',
        'key'      => $api_key,
    ),
    'https://maps.googleapis.com/maps/api/place/details/json'
);

$details_response = wp_remote_get(
    $details_endpoint,
    array(
        'timeout' => 10,
    )
);

if (is_wp_error($details_response)) {
    return '<p>' . esc_html__('No se pudieron obtener las reseñas en este momento.', 'meet-up-blocks') . '</p>';
}

$details_body = wp_remote_retrieve_body($details_response);
$data         = json_decode($details_body, true);

if (
    empty($data)
    || ! isset($data['status'])
    || 'OK' !== $data['status']
    || empty($data['result'])
) {
    return '<p>' . esc_html__('No hay reseñas disponibles o hubo un error en la respuesta de Google.', 'meet-up-blocks') . '</p>';
}

$result  = $data['result'];
$reviews = isset($result['reviews']) ? $result['reviews'] : array();

if (empty($reviews)) {
    return '<p>' . esc_html__('Este lugar aún no tiene reseñas públicas.', 'meet-up-blocks') . '</p>';
}

ob_start();
?>
<div class="meetup-google-reviews">
    <?php if (! empty($result['name'])) : ?>
        <h3 class="meetup-google-reviews__title">
            <?php echo esc_html($result['name']); ?>
        </h3>
    <?php endif; ?>

    <?php if (isset($result['rating'], $result['user_ratings_total'])) : ?>
        <p class="meetup-google-reviews__summary">
            <strong><?php echo esc_html($result['rating']); ?>/5</strong>
            <?php
            printf(
                /* translators: %d: total de reseñas. */
                esc_html__('basado en %d reseñas en Google.', 'meet-up-blocks'),
                intval($result['user_ratings_total'])
            );
            ?>
        </p>
    <?php endif; ?>

    <ul class="meetup-google-reviews__list">
        <?php foreach ($reviews as $review) : ?>
            <li class="meetup-google-reviews__item">
                <div class="meetup-google-reviews__header">
                    <?php if (! empty($review['author_name'])) : ?>
                        <strong class="meetup-google-reviews__author">
                            <?php echo esc_html($review['author_name']); ?>
                        </strong>
                    <?php endif; ?>

                    <?php if (isset($review['rating'])) : ?>
                        <span class="meetup-google-reviews__rating">
                            <?php echo intval($review['rating']); ?>/5
                        </span>
                    <?php endif; ?>
                </div>

                <?php if (! empty($review['text'])) : ?>
                    <p class="meetup-google-reviews__text">
                        <?php
                        $review_text = isset($review['text']) ? $review['text'] : '';
                        $truncated   = mb_substr($review_text, 0, 150);

                        if (mb_strlen($review_text) > 40) {
                            $truncated .= '…';
                        }

                        echo esc_html($truncated);
                        ?>
                    </p>
                <?php endif; ?>
            </li>
        <?php endforeach; ?>
    </ul>
</div>
<?php
echo ob_get_clean();

return;
