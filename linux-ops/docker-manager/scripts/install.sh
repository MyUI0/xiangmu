#!/bin/bash

# Docker 管理平台安装脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 打印彩色输出
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 检查 Node.js 是否安装
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安装，请先安装 Node.js (推荐 v14+)"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm 未安装"
        exit 1
    fi
    
    local node_version=$(node -v)
    print_info "Node.js 版本: $node_version"
}

# 检查 Docker 是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_warning "Docker 未安装，部分功能将不可用"
    else
        print_info "Docker 已安装"
    fi
}

# 安装依赖
install_dependencies() {
    print_info "开始安装后端依赖..."
    cd "$PROJECT_ROOT/backend"
    
    if [ -f "package.json" ]; then
        npm install
        print_success "后端依赖安装完成"
    else
        print_error "未找到 package.json 文件"
        exit 1
    fi
}

# 设置脚本执行权限
set_permissions() {
    print_info "设置脚本执行权限..."
    chmod +x "$SCRIPT_DIR/docker-manager.sh"
    chmod +x "$SCRIPT_DIR/install.sh"
    print_success "权限设置完成"
}

# 创建符号链接（可选）
create_symlink() {
    read -p "是否创建全局命令 'docker-manager'? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        local link_path="/usr/local/bin/docker-manager"
        if [ -L "$link_path" ]; then
            print_warning "符号链接已存在，将被覆盖"
            sudo rm "$link_path"
        fi
        sudo ln -s "$SCRIPT_DIR/docker-manager.sh" "$link_path"
        print_success "全局命令创建成功，可使用 'docker-manager' 命令"
    fi
}

# 主函数
main() {
    echo "===================================="
    echo "  Docker 管理平台 - 安装程序"
    echo "===================================="
    echo ""
    
    check_node
    check_docker
    echo ""
    
    install_dependencies
    set_permissions
    echo ""
    
    create_symlink
    echo ""
    
    echo "===================================="
    print_success "安装完成！"
    echo ""
    echo "使用方法："
    echo "  1. 命令行工具: $SCRIPT_DIR/docker-manager.sh help"
    echo "  2. 启动 Web 界面: cd $PROJECT_ROOT/backend && npm start"
    echo "     或使用: $SCRIPT_DIR/docker-manager.sh web"
    echo "===================================="
}

# 执行主函数
main "$@"
