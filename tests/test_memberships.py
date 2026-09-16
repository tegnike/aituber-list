import json
import unittest
from scripts.refresh_memberships import has_join_button


class MembershipTest(unittest.TestCase):
    def page(self, header, channel='UCtest', **extra):
        return 'var ytInitialData = ' + json.dumps({
            'metadata': {'channelMetadataRenderer': {'externalId': channel}},
            'header': header, **extra,
        }) + ';'

    def button(self, state='BUTTON_VIEW_MODEL_STATE_ACTIVE'):
        return {'buttonViewModel': {'accessibilityId': 'id.sponsor_button',
                                   'state': state, 'onTap': {'command': {}}}}

    def test_active_header_button(self):
        self.assertTrue(has_join_button(self.page({'actions': [self.button()]}), 'UCtest'))

    def test_description_and_recommendations_are_not_evidence(self):
        page = self.page({'description': 'Join membership /join id.sponsor_button'},
                         contents={'recommendation': self.button()})
        self.assertFalse(has_join_button(page, 'UCtest'))

    def test_disabled_button(self):
        self.assertFalse(has_join_button(self.page(self.button('DISABLED')), 'UCtest'))

    def test_wrong_channel_and_consent_page(self):
        for page in [self.page(self.button(), channel='UCother'), '<html>Consent</html>']:
            with self.assertRaises(ValueError):
                has_join_button(page, 'UCtest')


if __name__ == '__main__':
    unittest.main()
