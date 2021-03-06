<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>denkstrap-structure | {% block pageTitle %}{% endblock %}</title>

    <link rel="stylesheet" href="/css/main.css">
</head>
<body>

    {% block content %}
    {% endblock %}

    <script type="text/javascript" data-main="/js/app/main.js" src="/js/app/vendor/require.js"></script>

{% if not production %}
    <script type="text/javascript" src="//localhost:{{ liveReloadPort }}/livereload.js"></script>
{% endif %}

</body>
</html>
