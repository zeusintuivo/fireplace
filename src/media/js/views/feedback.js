define('views/feedback',
       ['core/capabilities', 'compat_filter', 'core/forms', 'core/l10n', 'core/notification',
        'core/requests', 'templates', 'core/urls', 'core/utils', 'core/z', 'utils_local'],
       function(caps, compatFilter, forms, l10n, notification,
                requests, nunjucks, urls, utils, z, utilsLocal) {
    var gettext = l10n.gettext;
    var notify = notification.notification;

    z.doc.on('submit', '.feedback-form', utils._pd(function(e) {
        // Used for both the feedback page and mkt-prompt.
        var $this = $(this);
        var data = $.extend(utils.getVars($this.serialize()), {
            chromeless: caps.chromeless ? 'Yes' : 'No',
            feedback: $this.find('[name="feedback"]').val(),
            from_url: window.location.pathname,
            profile: compatFilter.featureProfile
        });

        forms.toggleSubmitFormState($this);
        requests.post(urls.api.url('feedback'), data).done(function(data) {
            $this.find('textarea').val('');
            forms.toggleSubmitFormState($this, true);
            notify({message: gettext('Feedback submitted. Thanks!')});
        }).fail(function() {
            forms.toggleSubmitFormState($this, true);
            notify({
                message: gettext('There was a problem submitting your feedback. Try again soon.'),
                negativeAction: true
            });
        });
    }));

    function addFeedbackModalDesktop() {
        // Desktop feedback modal.
        if (!caps.widescreen() ||
            urls.reverse('feedback') === window.location.pathname) {
            return;
        }
        if (!$('.main.feedback').length && !$('mkt-prompt.feedback').length) {
            z.page.append(nunjucks.env.render('_includes/feedback_modal.html'));
        }
    }

    z.body.on('click', '.submit-feedback', function(e) {
        e.preventDefault();
        addFeedbackModalDesktop();
    });

    return function(builder) {
        var title = gettext('Feedback');

        builder.z('type', 'leaf settings sub_setting spoke-header feedback');
        builder.z('title', gettext('Feedback'));
        utilsLocal.headerTitle(title);
        builder.z('parent', urls.reverse('homepage'));

        builder.start('feedback.html').done(function() {
            addFeedbackModalDesktop();
        });
    };
});
