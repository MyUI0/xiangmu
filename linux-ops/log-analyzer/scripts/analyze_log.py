#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
import re
from collections import Counter

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../backend'))
from analyzer import LogAnalyzer


def print_banner():
    print("=" * 60)
    print("                日志分析工具")
    print("=" * 60)


def main():
    print_banner()
    
    if len(sys.argv) < 2:
        print("用法: python analyze_log.py <日志文件路径>")
        print("\n示例:")
        print("  python analyze_log.py /var/log/nginx/access.log")
        sys.exit(1)
    
    log_file = sys.argv[1]
    
    if not os.path.exists(log_file):
        print(f"错误: 文件不存在: {log_file}")
        sys.exit(1)
    
    print(f"\n正在分析文件: {log_file}")
    print("-" * 60)
    
    analyzer = LogAnalyzer()
    
    try:
        lines = analyzer.read_log_file(log_file)
        print(f"总行数: {len(lines)}")
        
        levels = analyzer.analyze_log_levels(lines)
        print("\n日志级别分布:")
        for level, count in sorted(levels.items(), key=lambda x: -x[1]):
            print(f"  {level:10s}: {count}")
        
        errors = analyzer.find_errors(lines)
        print(f"\n错误数: {len(errors)}")
        if errors:
            print("前 5 条错误:")
            for err in errors[:5]:
                print(f"  行 {err['line_number']}: {err['content'][:100]}...")
        
        ips = analyzer.extract_ips(lines)
        if ips:
            print("\nTop 5 IP 地址:")
            for ip, count in ips.most_common(5):
                print(f"  {ip:15s}: {count} 次")
        
        urls = analyzer.extract_urls(lines)
        if urls:
            print("\nTop 5 URL:")
            for url, count in urls.most_common(5):
                print(f"  {count:5d} 次: {url[:60]}...")
        
        timestamps = analyzer.extract_timestamps(lines)
        if timestamps:
            print(f"\n时间戳数量: {len(timestamps)}")
            time_dist = analyzer.analyze_temporal_distribution(timestamps)
            if time_dist:
                print("时间分布:")
                for time, count in list(time_dist.items())[:5]:
                    print(f"  {time}: {count} 条")
        
        print("\n" + "=" * 60)
        print("分析完成!")
        
    except Exception as e:
        print(f"分析失败: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
