"""Confirm public YouTube Join buttons. Missing evidence means unknown, never no."""
import json
import re
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

DATA_PATH = Path(__file__).resolve().parents[1] / 'app/data/aitubers.json'


def has_join_button(page, channel_id):
    match = re.search(r'var ytInitialData\s*=\s*', page)
    if not match:
        raise ValueError('YouTube initial data missing')
    data = json.JSONDecoder().raw_decode(page[match.end():])[0]
    metadata = data.get('metadata', {}).get('channelMetadataRenderer', {})
    if metadata.get('externalId') != channel_id or not data.get('header'):
        raise ValueError('Channel identity or header missing')

    def visit(value):
        if isinstance(value, list):
            return any(visit(item) for item in value)
        if not isinstance(value, dict):
            return False
        button = value.get('buttonViewModel', {})
        if (button.get('accessibilityId') == 'id.sponsor_button'
                and button.get('state') == 'BUTTON_VIEW_MODEL_STATE_ACTIVE'
                and button.get('onTap')):
            return True
        return any(visit(item) for item in value.values())

    # Only inspect this channel's header, not descriptions or recommended videos.
    return visit(data['header'])


def check_channel(row):
    channel_id = row['youtubeChannelID']
    url = f'https://www.youtube.com/channel/{channel_id}?hl=en'
    try:
        request = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urlopen(request, timeout=20) as response:
            confirmed = has_join_button(response.read().decode('utf-8'), channel_id)
        return row, confirmed, None
    except Exception as error:
        return row, False, type(error).__name__


def main():
    data = json.loads(DATA_PATH.read_text())
    rows = [row for row in data['aitubers'] if row.get('youtubeChannelID')]
    confirmed_count = errors = 0
    with ThreadPoolExecutor(max_workers=4) as pool:
        for row, confirmed, error in pool.map(check_channel, rows):
            if confirmed:
                row['youtubeMembership'] = {'confirmedAt': datetime.now(timezone.utc).isoformat()}
                confirmed_count += 1
                print(f"Confirmed: {row['name']}", flush=True)
            else:
                # Hide old evidence on failure or a missing button, without claiming disabled.
                row.pop('youtubeMembership', None)
            if error:
                errors += 1
                print(f"Unverified: {row['name']} ({error})", flush=True)
    DATA_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    print(f'Checked {len(rows)} channels; confirmed {confirmed_count}; fetch/parse errors {errors}')


if __name__ == '__main__':
    main()
