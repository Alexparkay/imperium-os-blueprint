# Plays a subtle notification sound when Claude Code completes a task.
# OPTIONAL, Windows only. Not wired by default (it lives in your machine-local
# settings, not the shared repo settings). To enable, add this entry to
# .claude/settings.local.json under hooks.Stop:
#
#   { "type": "command",
#     "command": "powershell -NoProfile -ExecutionPolicy Bypass -File \"$CLAUDE_PROJECT_DIR/.claude/hooks/task-complete-sound.ps1\"",
#     "timeout": 5 }
#
# On macOS/Linux, swap for `afplay` / `paplay` in a .sh hook instead.
(New-Object Media.SoundPlayer 'C:\Windows\Media\notify.wav').PlaySync()
