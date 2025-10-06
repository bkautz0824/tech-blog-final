#!/usr/bin/env python3

"""
Extract and upload articles from articles-data.ts to Convex
Uses regex and careful parsing to extract all article data
"""

import re
import json
import subprocess
import sys

def extract_articles(file_path):
    """Extract all articles from the TypeScript file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the articles array
    array_start = content.find('export const articles: Article[] = [')
    if array_start == -1:
        print("❌ Could not find articles array")
        return []

    # Extract everything after the opening bracket
    array_content = content[array_start:]

    # Split by article boundaries (careful with nested braces)
    articles = []
    current_article = ""
    brace_count = 0
    in_array = False
    in_backtick = False

    for i, char in enumerate(array_content):
        if array_content[i:i+2] == '= [':
            in_array = True
            continue

        if not in_array:
            continue

        # Track backticks for template literals
        if char == '`' and (i == 0 or array_content[i-1] != '\\'):
            in_backtick = not in_backtick

        # Track braces (but not inside strings)
        if not in_backtick:
            if char == '{':
                if brace_count == 0:
                    current_article = '{'
                else:
                    current_article += char
                brace_count += 1
            elif char == '}':
                current_article += char
                brace_count -= 1
                if brace_count == 0:
                    # End of an article object
                    articles.append(current_article)
                    current_article = ""
            elif brace_count > 0:
                current_article += char
        else:
            current_article += char

        # End of array
        if char == ']' and brace_count == 0 and not in_backtick and in_array:
            break

    print(f"\n📦 Extracted {len(articles)} raw article objects\n")
    return articles

def parse_article(article_text):
    """Parse a single article object into structured data"""
    try:
        # Extract ID (required)
        id_match = re.search(r'id:\s*"([^"]+)"', article_text)
        if not id_match:
            return None

        # Extract title
        title_match = re.search(r'title:\s*"([^"]+)"', article_text)

        # Extract description
        desc_match = re.search(r'description:\s*"([^"]+)"', article_text)

        # Extract category
        cat_match = re.search(r'category:\s*"([^"]+)"', article_text)

        # Extract date
        date_match = re.search(r'date:\s*"([^"]+)"', article_text)

        # Extract content (between backticks)
        content_match = re.search(r'content:\s*`(.*?)`(?:,|\s*\})', article_text, re.DOTALL)

        if not all([id_match, title_match, desc_match, cat_match, date_match, content_match]):
            print(f"⚠️  Skipping article {id_match.group(1) if id_match else 'unknown'} - missing required fields")
            return None

        # Extract URLs array
        urls = []
        urls_match = re.search(r'urls:\s*\[(.*?)\]', article_text, re.DOTALL)
        if urls_match:
            url_strings = re.findall(r'"([^"]+)"', urls_match.group(1))
            urls = url_strings

        # Extract key features array
        key_features = []
        kf_match = re.search(r'keyFeatures:\s*\[(.*?)\]', article_text, re.DOTALL)
        if kf_match:
            features = re.findall(r'"([^"]+)"', kf_match.group(1))
            key_features = features

        content = content_match.group(1)
        word_count = len(content.split())

        return {
            'id': id_match.group(1),
            'title': title_match.group(1),
            'description': desc_match.group(1),
            'category': cat_match.group(1),
            'date': date_match.group(1),
            'content': content,
            'urls': urls,
            'keyFeatures': key_features,
            'wordCount': word_count
        }

    except Exception as e:
        print(f"❌ Error parsing article: {e}")
        return None

def convert_article(article):
    """Convert article to Convex format with proper structure"""
    # Convert URLs to object format
    urls = []
    for url in article['urls']:
        domain = url.replace('https://', '').replace('http://', '').split('/')[0]
        urls.append({'title': domain, 'url': url})

    # Convert key features to object format
    key_features = []
    for feature in article['keyFeatures']:
        if ':' in feature:
            parts = feature.split(':', 1)
            key_features.append({'title': parts[0].strip(), 'description': parts[1].strip()})
        else:
            key_features.append({'title': feature, 'description': feature})

    # Generate tags
    tags = [article['category']]
    title_lower = article['title'].lower()
    content_lower = article['content'].lower()

    tag_keywords = {
        'React': ['react', 'jsx'],
        'Next.js': ['next', 'nextjs'],
        'TypeScript': ['typescript', 'ts'],
        'AI': ['ai', 'artificial intelligence', 'llm', 'gpt'],
        'Database': ['database', 'db', 'sql'],
        'Testing': ['test', 'testing', 'qa'],
        'Deployment': ['deploy', 'hosting', 'vercel'],
        'Mobile': ['mobile', 'ios', 'android', 'native'],
        'DevTools': ['tool', 'developer', 'devtools'],
    }

    for tag, keywords in tag_keywords.items():
        if any(kw in title_lower or kw in content_lower[:500] for kw in keywords):
            tags.append(tag)

    # Calculate quality score
    quality_score = calculate_quality_score(article['content'], article['wordCount'], len(key_features), len(urls))

    return {
        'id': article['id'],
        'title': article['title'],
        'description': article['description'],
        'category': article['category'],
        'date': article['date'],
        'content': article['content'],
        'urls': urls,
        'keyFeatures': key_features,
        'tags': list(set(tags)),
        'wordCount': article['wordCount'],
        'qualityScore': quality_score,
        'readingTime': (article['wordCount'] + 199) // 200,
        'slug': article['id'],
        'published': True
    }

def calculate_quality_score(content, word_count, features_count, urls_count):
    """Calculate article quality score"""
    score = 0

    # Word count (0-30)
    if word_count >= 3000:
        score += 30
    elif word_count >= 2000:
        score += 25
    elif word_count >= 1500:
        score += 20
    elif word_count >= 1000:
        score += 15
    else:
        score += 10

    # Features (0-20)
    if features_count >= 6:
        score += 20
    elif features_count >= 4:
        score += 15
    elif features_count >= 2:
        score += 10
    else:
        score += 5

    # URLs (0-15)
    if urls_count >= 5:
        score += 15
    elif urls_count >= 3:
        score += 12
    elif urls_count >= 1:
        score += 8

    # Content structure (0-35)
    headings = len(re.findall(r'^#{1,6}\s', content, re.MULTILINE))
    code_blocks = len(re.findall(r'```', content)) // 2
    lists = len(re.findall(r'^[-*+]\s', content, re.MULTILINE))

    if headings >= 10:
        score += 15
    elif headings >= 5:
        score += 10
    elif headings >= 3:
        score += 5

    if code_blocks >= 5:
        score += 10
    elif code_blocks >= 3:
        score += 7
    elif code_blocks >= 1:
        score += 5

    if lists >= 10:
        score += 10
    elif lists >= 5:
        score += 7
    elif lists >= 2:
        score += 4

    return min(score, 100)

def main():
    print("=" * 70)
    print("BATCH 2: Existing Articles Migration (Python Parser)")
    print("=" * 70)

    file_path = "/Users/bennettkautz/Desktop/projects/tech-blog/tech-blog-app/lib/articles-data.ts"

    # Extract articles
    print("\n📖 Reading articles-data.ts...")
    raw_articles = extract_articles(file_path)

    if not raw_articles:
        print("❌ No articles found")
        sys.exit(1)

    # Parse articles
    print("🔍 Parsing article data...\n")
    parsed_articles = []
    for raw in raw_articles:
        article = parse_article(raw)
        if article:
            parsed_articles.append(article)
            print(f"✓ {article['title'][:60]}... ({article['wordCount']:,} words)")

    print(f"\n📊 Successfully parsed {len(parsed_articles)} articles")

    # Convert to Convex format
    print("\n🔄 Converting to Convex format...\n")
    converted_articles = [convert_article(a) for a in parsed_articles]

    for article in converted_articles:
        print(f"✓ {article['title']}")
        print(f"  Word Count: {article['wordCount']:,}")
        print(f"  Quality Score: {article['qualityScore']}/100")
        print(f"  Tags: {', '.join(article['tags'])}")
        print()

    # Save to JSON file for upload
    output_file = "articles-to-upload.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(converted_articles, f, indent=2, ensure_ascii=False)

    print(f"\n💾 Saved {len(converted_articles)} articles to {output_file}")
    print("\n✅ Extraction complete! Now run: node scripts/upload-from-json.mjs\n")

if __name__ == "__main__":
    main()
