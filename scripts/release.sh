#!/bin/bash

# My Excalidraw Release Script
# 我的 Excalidraw 发布脚本

set -e

echo "🚀 My Excalidraw Release Script"
echo "================================"

# Check if version is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide a version number"
    echo "Usage: ./scripts/release.sh <version>"
    echo "Example: ./scripts/release.sh 1.0.0"
    exit 1
fi

VERSION=$1
TAG="v$VERSION"

echo "📦 Preparing release for version: $VERSION"

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Warning: You're not on the main branch (current: $CURRENT_BRANCH)"
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Release cancelled"
        exit 1
    fi
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: You have uncommitted changes"
    echo "Please commit or stash your changes before releasing"
    exit 1
fi

# Update version in package.json
echo "📝 Updating package.json version to $VERSION"
npm version $VERSION --no-git-tag-version

# Update CHANGELOG.md
echo "📝 Please update CHANGELOG.md with the new version information"
echo "Press any key to continue after updating CHANGELOG.md..."
read -n 1 -s

# Commit version changes
echo "💾 Committing version changes"
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore: bump version to $VERSION"

# Create and push tag
echo "🏷️  Creating and pushing tag: $TAG"
git tag -a $TAG -m "Release $TAG"
git push origin main
git push origin $TAG

echo "✅ Release $TAG has been created and pushed!"
echo "🔄 GitHub Actions will now build and create the release automatically"
echo "📋 You can monitor the progress at: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions"

echo ""
echo "🎉 Release process completed!"
echo "The release will be available at: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/releases"
