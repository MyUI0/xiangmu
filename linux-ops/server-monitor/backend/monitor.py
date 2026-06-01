#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import psutil
import platform
import time
import datetime
import json
import socket
import os


class SystemMonitor:
    """系统监控类，负责收集各项系统指标"""

    def __init__(self):
        self.hostname = socket.gethostname()
        self.ip_address = self._get_local_ip()

    def _get_local_ip(self):
        """获取本机IP地址"""
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(('8.8.8.8', 80))
            ip = s.getsockname()[0]
            s.close()
            return ip
        except Exception:
            return '127.0.0.1'

    def get_cpu_info(self):
        """获取CPU信息"""
        cpu_percent = psutil.cpu_percent(interval=1)
        cpu_freq = psutil.cpu_freq()
        cpu_cores = psutil.cpu_count(logical=True)
        cpu_physical_cores = psutil.cpu_count(logical=False)

        return {
            'percent': cpu_percent,
            'freq_current': cpu_freq.current if cpu_freq else 0,
            'freq_max': cpu_freq.max if cpu_freq else 0,
            'cores': cpu_cores,
            'physical_cores': cpu_physical_cores
        }

    def get_memory_info(self):
        """获取内存信息"""
        mem = psutil.virtual_memory()
        swap = psutil.swap_memory()

        return {
            'total': mem.total,
            'used': mem.used,
            'free': mem.free,
            'percent': mem.percent,
            'available': mem.available,
            'swap_total': swap.total,
            'swap_used': swap.used,
            'swap_percent': swap.percent
        }

    def get_disk_info(self):
        """获取磁盘信息"""
        disk_list = []
        for part in psutil.disk_partitions():
            try:
                usage = psutil.disk_usage(part.mountpoint)
                disk_list.append({
                    'device': part.device,
                    'mountpoint': part.mountpoint,
                    'fstype': part.fstype,
                    'total': usage.total,
                    'used': usage.used,
                    'free': usage.free,
                    'percent': usage.percent
                })
            except PermissionError:
                continue

        disk_io = psutil.disk_io_counters()
        io_stats = {
            'read_bytes': disk_io.read_bytes if disk_io else 0,
            'write_bytes': disk_io.write_bytes if disk_io else 0,
            'read_count': disk_io.read_count if disk_io else 0,
            'write_count': disk_io.write_count if disk_io else 0
        }

        return {
            'partitions': disk_list,
            'io': io_stats
        }

    def get_network_info(self):
        """获取网络信息"""
        net_io = psutil.net_io_counters()
        interfaces = psutil.net_if_addrs()
        net_connections = len(psutil.net_connections())

        interface_list = []
        for name, addrs in interfaces.items():
            ipv4 = None
            ipv6 = None
            mac = None
            for addr in addrs:
                if addr.family == socket.AF_INET:
                    ipv4 = addr.address
                elif addr.family == socket.AF_INET6:
                    ipv6 = addr.address
                elif addr.family == psutil.AF_LINK:
                    mac = addr.address
            interface_list.append({
                'name': name,
                'ipv4': ipv4,
                'ipv6': ipv6,
                'mac': mac
            })

        return {
            'bytes_sent': net_io.bytes_sent if net_io else 0,
            'bytes_recv': net_io.bytes_recv if net_io else 0,
            'packets_sent': net_io.packets_sent if net_io else 0,
            'packets_recv': net_io.packets_recv if net_io else 0,
            'errin': net_io.errin if net_io else 0,
            'errout': net_io.errout if net_io else 0,
            'dropin': net_io.dropin if net_io else 0,
            'dropout': net_io.dropout if net_io else 0,
            'interfaces': interface_list,
            'connections': net_connections
        }

    def get_process_info(self, limit=10):
        """获取进程信息，默认返回占用CPU最多的10个进程"""
        process_list = []
        for proc in psutil.process_iter(['pid', 'name', 'username', 'cpu_percent', 'memory_info']):
            try:
                pinfo = proc.info
                process_list.append({
                    'pid': pinfo['pid'],
                    'name': pinfo['name'],
                    'username': pinfo['username'],
                    'cpu_percent': pinfo['cpu_percent'],
                    'memory_rss': pinfo['memory_info'].rss,
                    'memory_vms': pinfo['memory_info'].vms
                })
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                continue

        process_list.sort(key=lambda x: x['cpu_percent'], reverse=True)
        return process_list[:limit]

    def get_system_info(self):
        """获取系统基本信息"""
        uname = platform.uname()
        boot_time = psutil.boot_time()
        uptime = time.time() - boot_time

        return {
            'hostname': self.hostname,
            'ip_address': self.ip_address,
            'system': uname.system,
            'release': uname.release,
            'version': uname.version,
            'machine': uname.machine,
            'processor': uname.processor,
            'boot_time': boot_time,
            'uptime': uptime
        }

    def get_all_metrics(self):
        """获取所有监控指标"""
        return {
            'timestamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'system': self.get_system_info(),
            'cpu': self.get_cpu_info(),
            'memory': self.get_memory_info(),
            'disk': self.get_disk_info(),
            'network': self.get_network_info(),
            'processes': self.get_process_info()
        }


def main():
    """主函数，用于测试监控功能"""
    monitor = SystemMonitor()
    metrics = monitor.get_all_metrics()
    print(json.dumps(metrics, indent=4, ensure_ascii=False))


if __name__ == '__main__':
    main()
