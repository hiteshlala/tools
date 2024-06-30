# This group came from installing ohmyzsh from below:
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
# Path to your oh-my-zsh installation.
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="robbyrussell"
plugins=(git)
source $ZSH/oh-my-zsh.sh


# My personaal aliasses
alias cd~="cd ~/"
alias cdh="cd ~/hitesh"
alias cdp="cd ~/Programming"
alias cdt="cd ~/Programming/tools"
alias cdr="cd ~/Programming/runestone"
alias cdm="cd ~/Music/Music/Media.localized/Music"
alias uuid="uuidgen | tr A-Z a-z | tee >(tr -d '\n' | pbcopy)"
alias listening='lsof -i TCP -s TCP:LISTEN -P'
alias cd..="cd .."
alias h="history"
alias py3="python3"
alias gsr="git show-ref"
alias gmessages='git log --pretty="format:%h-%an: %s" $(git show-ref -s origin/main)..HEAD'
alias gmessagesnn='git log --reverse --pretty="format:%s" $(git show-ref -s origin/main)..HEAD'
alias gauthors='git shortlog -sne --all'


# Added by NVM when first installed
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion


# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/opt/anaconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/opt/anaconda3/etc/profile.d/conda.sh" ]; then
        . "/opt/anaconda3/etc/profile.d/conda.sh"
    else
        export PATH="/opt/anaconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<

